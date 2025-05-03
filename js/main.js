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
console.log(path);

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded");

  try {
    await renderHeaderAndFooter();
    console.log("await renderHeaderAndFooter()");

    if ((path === "/index.html") | (path === "/")) {
      console.log("/index.html");
      // console.log("首頁的功能們");

      // 渲染台灣地圖
      taiwanMap.init();
      console.log("taiwanMap.init();");

      // 渲染縣市及探測站選單 & 空污資訊
      const counties = await getCountyAndStation("county");
      console.log("await getCountyAndStation('county')");
      const allStations = await getCountyAndStation({ county: "total" });
      console.log("await getCountyAndStation({ county: 'total' })");
      const allStationAirData = await getAirData("total");
      console.log("await getAirData('total')");
      window["allStations"] = allStations;
      console.log(allStations);
      window["allStationAirData"] = allStationAirData;
      console.log(allStationAirData);
      renderSearchCounty(counties); // 渲染縣市下拉選單
      console.log("renderSearchCounty(counties)");

      onStationListClick(); // 監聽縣市下拉選單並渲染監測站按鈕
      console.log("onStationListClick()");
      onAirDataDomClick(); //監聽監測站按鈕
      console.log("onAirDataDomClick()");

      const currentLocationData = await getGeolocation(); //最近的監測站和即時 aqi，{sitename: '豐原', county: '臺中市', siteid: '28', aqi: '73'}
      console.log("await getGeolocation()");

      const previousPageBtn = document.getElementById("previous-page-btn");
      previousPageBtn.style.display = "flex";
      previousPageBtn.addEventListener("click", () => {
        window.location.href = "/previous.html";
      });
      console.log("previousPageBtn.addEventListener");
    }
  } catch (error) {
    console.error(error);
  }

  if (path === "/previous") {
    const currentLocationData = await getGeolocation(); //最近的監測站和即時 aqi，{sitename: '豐原', county: '臺中市', siteid: '28', aqi: '73'}
    // console.log("歷史監測資料");
    console.log("await getGeolocation()");
    revisePreviousPage(); //頁面調整
    console.log("revisePreviousPage()");
    createPreviousSelect(currentLocationData); //縣市探測站渲染
    console.log("revisePreviousPage()");
    confirmPreviousSelect(); //送出圖表需求
    console.log("confirmPreviousSelect()");
  }
});
