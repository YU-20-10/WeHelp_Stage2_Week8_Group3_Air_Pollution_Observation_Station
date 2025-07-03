import { renderHeaderAndFooter, getGeolocation } from "./feature/headerAndFooter.js";
import { getAirData } from "./function/getAirData.js";
import { getCountyAndStation } from "./function/getCountyAndStation.js";
import taiwanMap from "./feature/taiwanMap.js";
import { createPreviousSelect } from "./feature/createPreviousSelect.js";
import { confirmPreviousSelect } from "./feature/confirmPreviousSelect.js";
import { renderSearchCounty } from "./feature/renderSearchConty.js";
import { onStationListClick } from "./feature/onStationListClick.js";
import { onAirDataDomClick } from "./feature/renderStationAirData.js";
import { revisePreviousPage } from "./feature/revisePreviousPage.js";
import { renderStationAirDataDom } from "./feature/renderStationAirData.js";

document.addEventListener("DOMContentLoaded", async () => {
  await renderHeaderAndFooter();

  const path = window.location.pathname;
  // console.log(path);
  if (path === "/") {
    // console.log("首頁的功能們");

    // 渲染台灣地圖
    taiwanMap.init();

    // 渲染縣市及探測站選單 & 空污資訊
    const counties = await getCountyAndStation("county");
    const allStations = await getCountyAndStation({ county: "total" });
    const allStationAirData = await getAirData("total");
    window["allStations"] = allStations;
    window["allStationAirData"] = allStationAirData;
    renderSearchCounty(counties); // 渲染縣市下拉選單
    onStationListClick(); // 監聽縣市下拉選單並渲染監測站按鈕
    onAirDataDomClick(); //監聽監測站按鈕

    const currentLocationData = await getGeolocation();//最近的監測站和即時 aqi，{sitename: '豐原', county: '臺中市', siteid: '28', aqi: '73'}
    //如果偵測到最近的監測站資料，渲染首頁畫面
    if(currentLocationData){
      renderStationAirDataDom(currentLocationData["sitename"]);
      taiwanMap.clickHandler(currentLocationData["county"]);
    };
    const previousPageBtn = document.getElementById("previous-page-btn");
    previousPageBtn.style.display = "flex";
    previousPageBtn.addEventListener("click", () => {
      window.location.href = "/previous";
    });
  }

  if (path === "/previous") {
    const currentLocationData = await getGeolocation();//最近的監測站和即時 aqi，{sitename: '豐原', county: '臺中市', siteid: '28', aqi: '73'}
    // console.log("歷史監測資料");

    revisePreviousPage(); //頁面調整
    createPreviousSelect(currentLocationData); //縣市探測站渲染
    confirmPreviousSelect(); //送出圖表需求
  }
});
