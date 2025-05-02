
/** 渲染首頁右側搜尋介面
 * @description 渲染標題、敘述及縣市下拉選單
 * @param counties 縣市的list，由getCountyAndStation("county")取得
 */
export const renderSearchCounty = async (counties) => {
  // let newAirDataWrapper = document.createElement("div");// 新增一個外包裝
  let newAirDataDom = document.createElement("div");
  let newAirDataTitle = document.createElement("div");
  let newAirDataTitleText = document.createTextNode("全國空氣指標即時觀測");
  let newAirSearchDiv = document.createElement("div");
  let newSearchTitle = document.createElement("div");
  let newSearchTitleText =
    document.createTextNode("直接點擊地圖選擇探測站或是");
  let newSearchSelect = document.createElement("select");

  // 設定id，加入class
  // newAirDataWrapper.className = "airDataWrapper";
  newSearchSelect.id = "countySelect";
  newSearchSelect.className = "airData__search__countySelect text-base-400";
  newAirDataDom.classList.add("airData");
  newAirDataDom.id = "airDataDom";
  newAirDataTitle.className = "airData__Title text-2xl-700";
  newAirSearchDiv.className = "airData__search";
  newSearchTitle.className = "airDtat__search__title text-lg-700";

  // 建立初始選項
  let defaultOption = document.createElement("option");
  defaultOption.textContent = "縣市";
  defaultOption.value = "";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  newSearchSelect.appendChild(defaultOption);

  // 建立選項，conties為main.js呼叫函式並獲得的資料
  counties.forEach((county) => {
    let option = document.createElement("option");
    option.value = county;
    option.textContent = county;
    newSearchSelect.appendChild(option);
  });

  // 組合DOM
  document.querySelector("main").appendChild(newAirDataDom);
  // newAirDataWrapper.appendChild(newAirDataDom);
  newAirDataDom.appendChild(newAirDataTitle);
  newAirDataTitle.appendChild(newAirDataTitleText);
  newAirDataDom.appendChild(newAirSearchDiv);
  newAirSearchDiv.appendChild(newSearchTitle);
  newSearchTitle.appendChild(newSearchTitleText);
  newAirSearchDiv.appendChild(newSearchSelect);
};
