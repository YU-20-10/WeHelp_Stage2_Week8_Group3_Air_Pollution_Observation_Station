# 專案網站
## 主題： 空氣品質探測站
### https://www.airpullution.site/

### 網站功能
全台灣空氣污染指標

1. 全台即時空污詳細資訊 --> 每小時更新一次
2. 各地區探測站結合列表形式
3. 各地區一週前空氣品質歷史資料(圖表)
4. 推播當前空汙資料至 discord #bot 頻道

### 技術主題
1. SVG Graph and Animation
2. Chart.js
3. 串接 API，來源: 環境部環境資料開放平台開放資料
4. 串接 Discord Webhook 

![bootcamp project](/gif-image/bootcamp%20project.jpg)

### 組員
 張兆丞
 廖宜昀
 周意惠
 王妤甄

### 組員分工方式
#### 兆丞：
1. 安排會議時間
2. Discord 後端路由撰寫
3. 撰寫抓取當下位置(經緯度)後端路由
4. 協調 pull request 檔案合併衝突問題
5. AWS EC2 網站佈署

#### 宜昀：
1. 功能發想，分工討論
2. 介面規格設計及定義設計規範，css guideline 編寫
3. Chart.js 研究及實作
4. 串接當前位置功能到畫面並帶入預設值
5. 協助 UI/UX 優化及 debug
```javascript
    getGeolocation() //return {sitename: '豐原', county: '臺中市', siteid: '28', aqi: '73'}
    getChartData(county, siteId, subindex)  //新北市, 9 ,['AQI', 'PM25', 'NO2']
```

#### 意惠：
1. 功能發想，分工討論
2. 站點 API 、即時空氣品質 API 串接與資料整理
3. 縣市選單頁面、即時資料表格動態生成，並依空氣品質分級顯示不同顏色
4. discord button 串接後端路由
5. 提供共用function供組員使用 
```js
getAirData("tottal")
getCountyAndStation("新北市")
renderCountyStations("新北市")
renderStationAirDataDom("三重")
```
#### 妤甄：
1. 結合 D3 與地理資料繪製台灣地圖
2. 使用D3.js與JS實現互動式視覺效果
3. 串接組員function實現觀測站點位置渲染及即時依空氣品質分級顏色渲染

## 網站 DEMO
### 點擊地圖出現該縣市名稱以及連動右側表單
![](/gif-image/地圖互動-hover%20顯示縣市及站點並直接顯示資料.gif)
### 根據不同數值對應不同級別的顏色
![](/gif-image/測點顯示，根據數值最顏色及視覺對應.gif)
### 選單內的地區以及測站及時對應地圖上的位置
![](/gif-image/測點顯示.gif)
### 結合 Discord 發送精華版測站偵測的數值
![](/gif-image/發送%20bot.gif)
### 點擊歷史監測資料即時呈現附近偵測站並呈現於選單並提供當前AQI數值
![](/gif-image/帶入最近測站.gif)
### 選取欲知曉的當前空汙數值並以圖表呈現
![](/gif-image/根據監測需求繪製圖表，hover%20顯示對應單位.gif)
### 至少必須選擇一個欲知的數值
![](/gif-image/ux%20防呆，確保至少一個探測站及一個監測項目.gif)
### RWD 首頁模板：點擊觀測站馬上跳至選單並且可得知當前空汙狀況
![](/gif-image/mobile-首頁.gif)
### RWD 歷史資料模板：確保手機使用者有良好體驗，完整呈現圖表
![](/gif-image/mobile-歷史資料.gif)


## 參考資料
1. [對照圖表](https://airtw.moenv.gov.tw/CHT/Information/Standard/AirQualityIndicator.aspx)
2. [空氣品質指標(AQI)](https://data.gov.tw/dataset/40448)
3. [環境部環境資料開放平台開放資料API](https://data.moenv.gov.tw/swagger/#/)
4. [直轄市、縣市界線(TWD97經緯度](https://data.gov.tw/dataset/7442)
