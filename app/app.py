# main.py
import os
import math
import asyncio
from typing import List
import httpx
import requests
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import HTMLResponse, JSONResponse,FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# --------- 讀取 .env 變數 ---------
load_dotenv()
API_URL              = os.getenv("API_URL")
API_KEY              = os.getenv("API_KEY")
WEBHOOK_URL          = os.getenv("WEBHOOK_URL")
REFRESH_INTERVAL_MIN = int(os.getenv("REFRESH_INTERVAL_MIN", "60"))

# --------- FastAPI Lifespan 處理 ---------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 啟動時啟 scheduler
    start_scheduler()
    yield
    # （若需 shutdown 清理，可在這裡加入）

app = FastAPI(lifespan=lifespan)

# 用來記錄最新 ImportDate
_last_import: str = None

class SiteSelection(BaseModel):
    county: str
    sitename: str

# --------- 工具函式 ---------
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # 地球半徑 (km)
    φ1, φ2 = math.radians(lat1), math.radians(lat2)
    Δφ = math.radians(lat2 - lat1)
    Δλ = math.radians(lon2 - lon1)
    a = math.sin(Δφ/2)**2 + math.cos(φ1)*math.cos(φ2)*math.sin(Δλ/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

def find_nearest(records, lat, lon, max_km=10):
    candidates = []
    for r in records:
        try:
            rl, rn = float(r["latitude"]), float(r["longitude"])
        except:
            continue
        d = haversine(lat, lon, rl, rn)
        if d <= max_km:
            candidates.append((r, d))
    candidates.sort(key=lambda x: x[1])
    return [r for r, _ in candidates]

# --------- 資料擷取與 Discord 推播 ---------
async def fetch_all_records() -> List[dict]:
    async with httpx.AsyncClient(verify=False) as client:
        resp = await client.get(
            API_URL,
            params={
                "api_key": API_KEY,
                "format": "JSON",
                "limit": 1000,
                "sort": "ImportDate desc"
            }
        )
        resp.raise_for_status()
        return resp.json().get("records", [])

def build_embed(data: dict) -> dict:
    aqi = data.get("aqi", "N/A")
    try:
        aqi_val = int(aqi)
    except:
        aqi_val = None

    if aqi_val is None:
        remark, color = "無資料", 0x808080
    elif aqi_val <= 50:
        remark, color = "👍 空氣品質良好，適合戶外活動!", 0x39BCBE
    elif aqi_val <= 100:
        remark, color = "👌 普通，長時間戶外要注意體感。", 0x08A2A5
    elif aqi_val <= 150:
        remark, color = "⚠️ 對敏感族群不佳，請減少戶外活動。", 0xFCB165
    elif aqi_val <= 200:
        remark, color = "⚠️ 對所有族群不健康，建議減少外出。", 0xEE963B
    elif aqi_val <= 300:
        remark, color = "🚨 非常不健康，建議避免外出。", 0xF27E6E
    else:
        remark, color = "☠️ 危害健康，應留在室內並採取防護措施。", 0xBF4B3B
    city = f"{data['county']} / {data['sitename']}"
    return {
        "username": "空汙偵測小幫手 🌤️",
        "content": None,
        "embeds": [{
            "title": "🌆 空氣品質快報",
            "url":"https://www.airpullution.site/",
            "description": f"{city} 當前空氣品質數據如下:",
            "color": color,
            "timestamp": data.get("publishtime_iso"),
            "fields": [
                {"name": "地區", "value": city, "inline": True},
                {"name": "AQI", "value": aqi, "inline": True},
                {"name": "狀態", "value": data.get("status","N/A"), "inline": True},
                {"name": "PM2.5", "value": data.get("pm2.5","N/A"), "inline": True},
                {"name": "PM10", "value": data.get("pm10","N/A"), "inline": True},
                {"name": "O₃", "value": data.get("o3","N/A"), "inline": True},
                {"name": "CO", "value": data.get("co","N/A"), "inline": True},
                {"name": "SO₂", "value": data.get("so2","N/A"), "inline": True},
                {"name": "NO₂", "value": data.get("no2","N/A"), "inline": True},
                {"name": "風速(m/s)", "value": data.get("wind_speed","N/A"), "inline": True},
                {"name": "風向(°)", "value": data.get("wind_direc","N/A"), "inline": True},
                {"name": "更新時間", "value": data.get("publishtime","N/A"), "inline": False},
                {"name": "📝 建議活動", "value": remark, "inline": False},
            ],
            "footer": {
                "text": "資料來源：環境部環境資料平台",
                "icon_url":"https://cdn-icons-png.flaticon.com/128/8635/8635653.png"  
}
        }]
    }

def send_to_discord(payload: dict):
    resp = requests.post(WEBHOOK_URL, json=payload, timeout=10)
    resp.raise_for_status()

async def check_and_notify():
    global _last_import
    try:
        records = await fetch_all_records()
        if not records:
            return
        newest = records[0]["ImportDate"]
        if newest != _last_import:
            _last_import = newest
            payload = build_embed(records[0])
            send_to_discord(payload)
    except Exception as e:
        print("Scheduler error:", e)

def start_scheduler():
    sched = AsyncIOScheduler()
    sched.add_job(lambda: asyncio.create_task(check_and_notify()),
                  "interval", minutes=REFRESH_INTERVAL_MIN)
    sched.start()

# --------- FastAPI 路由 ---------
@app.get("/stations")
async def stations():
    recs = await fetch_all_records()
    return {"records": [
        {"county": r["county"], "sitename": r["sitename"],
         "lat": r.get("latitude"), "lon": r.get("longitude")} for r in recs
    ]}

@app.get("/stations/nearby")
async def stations_nearby(
    lat: float = Query(..., description="緯度"),
    lon: float = Query(..., description="經度"),
    km: float = Query(5, description="範圍公里數")
):
    recs = await fetch_all_records()
    near = find_nearest(recs, lat, lon, km)
    return {"records": [{"county": r["county"], "sitename": r["sitename"]} for r in near]}

@app.get("/auto_notify")
async def auto_notify(lat: float = Query(...), lon: float = Query(...), km: float = Query(5)):
    recs = await fetch_all_records()
    near = find_nearest(recs, lat, lon, km)
    if not near:
        raise HTTPException(404, f"範圍 {km}km 內找不到任何測站")
    station = near[0]
    # print("資料一", station)
    # payload = build_embed(station)
    # print(payload)
    # send_to_discord(payload)
    return JSONResponse({
        "data":{
            'sitename': station["sitename"], 
            'county': station["county"],
            'siteid': station["siteid"],
            'aqi': station["aqi"]
        }
        # "message": f"已自動推播最近測站：{station['county']}/{station['sitename']}，AQI {station.get('aqi','N/A')}"
    })

@app.post("/send_message")
async def send_message(data: SiteSelection):
    # print(data)
    recs = await fetch_all_records()
    match = next((r for r in recs if r["county"] == data.county and r["sitename"] == data.sitename), None)
    if not match:
        raise HTTPException(404, f"找不到 {data.county}/{data.sitename}")
    payload = build_embed(match)
    send_to_discord(payload)
    return JSONResponse({"message": f"已推播 {data.county}/{data.sitename} AQI {match.get('aqi','N/A')}"})
    
#  ----------- Static Pages -----------

# 根目錄對應 index.html
@app.get("/", response_class=HTMLResponse)
async def index():
    return FileResponse("./static/index.html")

# 通用路由：讓 /xxx 對應 xxx.html（例如 /previous -> ./static/previous.html）
@app.get("/{page_name}", response_class=HTMLResponse)
async def serve_page(page_name: str):
    filename = f"./static/{page_name}.html"
    print(f"Requested file: {filename}")
    if os.path.exists(filename):
        return FileResponse(filename)
    raise HTTPException(status_code=404, detail="Page not found")

# app.mount("/", StaticFiles(directory=".", html=True), name="static")
app.mount("/static", StaticFiles(directory="static", html=True), name="static")
