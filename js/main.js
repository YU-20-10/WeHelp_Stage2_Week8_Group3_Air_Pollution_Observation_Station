import {
  renderHeaderAndFooter,
  getGeolocation,
} from "./feature/headerAndFooter.js";
import { getAirData } from "./function/getAirData.js";
import { getCountyAndStation } from "./function/getCountyAndStation.js";
import taiwanMap from "./feature/taiwanMap.js";
import { createPreviousSelect } from "./feature/createPreviousSelect.js";
import { confirmPreviousSelect } from "./feature/confirmPreviousSelect.js";
import { renderSearchCounty } from "./feature/renderSearchConty.js";
import { onStationListClick } from "./feature/onStationListClick.js";
import { onAirDataDomClick } from "./feature/renderStationAirData.js";
import { revisePreviousPage } from "./feature/revisePreviousPage.js";

console.log("main.js loaded");
console.log(renderHeaderAndFooter, getGeolocation);
console.log(getAirData);
console.log(getCountyAndStation);
console.log(taiwanMap);
console.log(createPreviousSelect);
console.log(confirmPreviousSelect);
console.log(renderSearchCounty);
console.log(onStationListClick);
console.log(onAirDataDomClick);
console.log(revisePreviousPage);

const path = window.location.pathname;

document.addEventListener("DOMContentLoaded", async () => {

  try {
    await renderHeaderAndFooter();
    console.log("await renderHeaderAndFooter()");

    if (path.endsWith("/") || path.endsWith("/index.html")) {
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

      const currentLocationData = await getGeolocation(); //最近的監測站和即時 aqi，{sitename: '豐原', county: '臺中市', siteid: '28', aqi: '73'}

      const previousPageBtn = document.getElementById("previous-page-btn");
      previousPageBtn.style.display = "flex";
      previousPageBtn.addEventListener("click", () => {
        window.location.href = "previous.html";
      });
    }
  } catch (error) {
    console.error(error);
  }

  if (path.endsWith("/previous.html")) {
    const currentLocationData = await getGeolocation(); //最近的監測站和即時 aqi，{sitename: '豐原', county: '臺中市', siteid: '28', aqi: '73'}
    // console.log("歷史監測資料");
    revisePreviousPage(); //頁面調整
    createPreviousSelect(currentLocationData); //縣市探測站渲染
    confirmPreviousSelect(); //送出圖表需求
  }
});
