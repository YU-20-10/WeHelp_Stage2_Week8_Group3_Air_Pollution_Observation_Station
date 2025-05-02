import taiwanMap from "./taiwanMap.js";

/** 縣市下拉選單監聽
 * @description 監聽縣市下拉選單，點擊可渲染該縣市監測站
 */
export function onStationListClick() {
  document
    .getElementById("countySelect")
    .addEventListener("change", async (event) => {
      // 取得點擊的縣市資料
      const selectedCounty = event.target.value;
      // console.log(selectedCounty);
      renderCountyStations(selectedCounty);
      taiwanMap.clickHandler(selectedCounty);
    });
}

/** 渲染任一縣市的監測站按鈕
 * @description 帶入縣市名即可渲染該縣市的監測站按鈕
 * @param county 縣市名稱，例如"基隆市"、"新北市"
 */
export function renderCountyStations(county) {
  
  // 如果目前有監測站的空汙資訊，直接移除並渲染該縣市的監測站
  let airDataWrapper = document.querySelector(".airDataWrapper");
  if(airDataWrapper!==null){
    document.querySelector("main").removeChild(airDataWrapper);
    document.getElementById("airDataDom").classList.remove("display-none");
  }

  const allStations = window["allStations"];
  // 更新 select 選單的值
  document.getElementById("countySelect").value = county;

  // 過濾點擊的縣市有哪些測站
  const stationData = allStations.filter((item) => item.county === county);
  // console.log("該縣市的測站資料：", stationData);

  // 取得容器DOM
  let airDataDOM = document.getElementById("airDataDom");

  // 若有舊的StationDom，要先移除
  const oldStationDom = airDataDOM.querySelector(".airData__station");
  if (oldStationDom) {
    airDataDOM.removeChild(oldStationDom);
  }

  // 渲染該縣市的監測站
  let newStationData = document.createElement("div");
  newStationData.className = "airData__station";
  document.getElementById("airDataDom").appendChild(newStationData);
  stationData.forEach((item) => {
    let newStationBtn = document.createElement("button");
    let newStationBtnText = document.createTextNode(item.sitename);
    newStationBtn.appendChild(newStationBtnText);
    newStationBtn.className = "airData__station__btn text-sm-500";
    document.querySelector(".airData__station").appendChild(newStationBtn);
  });
}
