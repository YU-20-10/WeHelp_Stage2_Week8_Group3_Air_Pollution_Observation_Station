import { getAqiBackgroundColor,getAqiDisdordBackgroundColor, getAqiImgUrl } from "../function/getAqiColorAndImgUrl.js";
import { getAnaylyzeStationAirData } from "../function/getAnalyzeStationAirData.js";
import { getAirDataHtml } from "../function/getAirDataHtml.js";
import { sendMessage } from "../function/sendMessageToDiscord.js";

/** 空汙詳細資料畫面渲染
 * @description 帶入監測站站名就會渲染該畫面DOM
 * @param stationName 空汙站名。例如 南投、竹山等等。
 */
export function renderStationAirDataDom(stationName) {
  const allStationAirData = window["allStationAirData"];
  // 取得該監測站的空汙資料
  let stationAirData = allStationAirData.find(
    (item) => item.sitename === stationName
  );
  //   console.log(stationAirData);
  const AQIScore = stationAirData.aqi;

  // 確認是否已有監測站的空屋資料畫面，如果有則先移除
  let oldAirDataWrapper = document.querySelector(".airDataWrapper");
  if (oldAirDataWrapper !== null) {
    document.querySelector("main").removeChild(oldAirDataWrapper);
  }

  // 新增一個外包裝
  let newAirDataWrapper = document.createElement("div");
  newAirDataWrapper.className = "airDataWrapper";
  document.querySelector("main").appendChild(newAirDataWrapper);

  // 取得容器DOM
  const airDataDOM = document.getElementById("airDataDom");
  airDataDOM.classList.add("display-none");
  const airDataWrapper = document.querySelector(".airDataWrapper");

  // 渲染監測站空汙資料
  // 監測站名稱、分數
  let newStationAirDataHeader = document.createElement("div");
  newStationAirDataHeader.className = "airData__stationDataHead";

  airDataWrapper.appendChild(newStationAirDataHeader);
  // airDataDOM.appendChild(newStationAirDataHeader);
  newStationAirDataHeader.classList.add(getAqiBackgroundColor(AQIScore)); //呼叫getAqiColor

  // 概要框框
  let newStationSummary = document.createElement("div");
  newStationSummary.className = "airData__stationDataHead__summary";
  newStationAirDataHeader.appendChild(newStationSummary);

  // 概要內的左側文字DOM
  let newStationTitle = document.createElement("div");
  newStationTitle.className = "stationDataHead__summary__title";
  newStationSummary.appendChild(newStationTitle);

  let newStationLocation = document.createElement("div");
  newStationLocation.className = "text-sm-700 ";
  let newStationLocationText = document.createTextNode(
    `${stationAirData.county}/${stationAirData.sitename}`
  );
  newStationLocation.appendChild(newStationLocationText);

  let newStationAQI = document.createElement("div");
  newStationAQI.className = "text-xl-700";
  let newStationAQIText = document.createTextNode("空氣汙染指標 AQI");
  newStationAQI.appendChild(newStationAQIText);

  newStationTitle.appendChild(newStationLocation);
  newStationTitle.appendChild(newStationAQI);

  // 概要內的右側圖示與分數
  let newAQIStatus = document.createElement("div");
  newAQIStatus.className = "stationDataHead__summary__status";
  newStationSummary.appendChild(newAQIStatus);

  let newStatusImg = document.createElement("img");
  newStatusImg.className = "summary__status__img";
  newStatusImg.src = getAqiImgUrl(AQIScore); // 呼叫getAqiImgUrl獲得該分數的圖片url
  newAQIStatus.appendChild(newStatusImg);

  let newAQIScroe = document.createElement("div");
  newAQIScroe.className = "summary__status__AQI";
  let newScore = document.createElement("div");
  newScore.className = "text-xl-700 status__AQI__score";
  let newScoreText = document.createTextNode(AQIScore);
  newScore.appendChild(newScoreText);
  newAQIScroe.appendChild(newScore);

  let newStatus = document.createElement("div");
  newStatus.className = "text-sm-500 status__AQI__status";
  let newStatusText = document.createTextNode(stationAirData.status);
  newStatus.appendChild(newStatusText);
  newAQIScroe.appendChild(newStatus);

  newAQIStatus.appendChild(newAQIScroe);

  //新增時間
  let newTimeDiv = document.createElement("div");
  newTimeDiv.className = "airData__stationDataHead__time text-xs-500";
  newTimeDiv.innerText = `偵測時間：${stationAirData.publishtime}`;
  document.querySelector(".airData__stationDataHead").appendChild(newTimeDiv);

  // 新增叉叉
  let newCrossImg = document.createElement("img");
  newCrossImg.className = "airData__stationDataHead__cross";
  newCrossImg.src = "../static/image/cross.png";
  document.querySelector(".airData__stationDataHead").appendChild(newCrossImg);

  // 渲染空污資料
  let newAirDataContent = document.createElement("div");
  newAirDataContent.className = "airData__content";
  airDataWrapper.appendChild(newAirDataContent);

  // 取得用來建立資料表的資料格式
  let airDataAnalyze = getAnaylyzeStationAirData(stationAirData);
  // console.log({ 此站資料: stationAirData });

  // 取得html格式
  let airDataHTML = getAirDataHtml(airDataAnalyze);
  newAirDataContent.innerHTML = airDataHTML;

  // Discord按鈕
  let newDiscordDiv = document.createElement("div");
  newDiscordDiv.className = "airData__discord";
  airDataWrapper.appendChild(newDiscordDiv);
  let newDiscordBtn = document.createElement("button");
  let discordBtnColorClass = getAqiDisdordBackgroundColor(AQIScore);
  newDiscordBtn.className = `airData__discord__btn text-sm-500 ${discordBtnColorClass}`;
  newDiscordBtn.innerText = "發送至Discord";
  newDiscordDiv.appendChild(newDiscordBtn);

  // discord圖片
  let newDiscordImg = document.createElement("img");
  newDiscordImg.className = "airData__discord__img";
  newDiscordImg.src = "../static/image/discord.png";
  newDiscordBtn.appendChild(newDiscordImg);

  // 監聽discord btn
  let sendStationData = {
    county: stationAirData.county,
    sitename: stationAirData.sitename,
  };
  // console.log(sendStationData);
  let discordBtn = document.querySelector(".airData__discord__btn");
  discordBtn.addEventListener("click", function () {
    // console.log("監聽成功", sendStationData);
    sendMessage(sendStationData);
  });

  // 點擊叉叉回到選擇縣市畫面
  document
    .querySelector(".airData__stationDataHead__cross")
    .addEventListener("click", function () {
      airDataDOM.classList.remove("display-none");
      document.querySelector("main").removeChild(airDataWrapper);
    });
}

/** 監測站按鈕監聽
 * @description 監聽監測站按鈕，點擊可渲染資料畫面
 */
export function onAirDataDomClick() {
  document
    .getElementById("airDataDom")
    .addEventListener("click", async (event) => {
      if (event.target.classList.contains("airData__station__btn")) {
        const stationName = event.target.textContent;
        // console.log("點擊監測站：", stationName);
        renderStationAirDataDom(stationName);
      }
    });
}
