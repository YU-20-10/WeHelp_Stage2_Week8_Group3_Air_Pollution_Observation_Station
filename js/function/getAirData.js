import { getCountyAndStation } from "./getCountyAndStation.js"

export async function getAirData(param) {
  try {
    let response = await fetch(
      "https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=b68831b5-fc06-4223-879c-9d92b9d4d293&limit=1000&sort=ImportDate%20desc&format=JSON"
    );
    let data = await response.json();
    
    // 如果fetch到的資料包含所有測站資料，進行以下
    if (data.include_total === true) {
      let airData = data.records; //airData為一個陣列，包含所有測站的大氣資料

      // 過濾多餘的監測站資料
      let stationData =await getCountyAndStation({county:"total"}); // 取得監測站資料
      const siteNamesInStationData = stationData.map(item=>item.sitename);
      const filterAirtData = airData.filter(item=>siteNamesInStationData.includes(item.sitename));

      // 根據不同參數給出不同資料
      // total，給出資料為縣市、監測站ID、監測站名稱、經緯度、狀態、aqi分數、時間
      if (param === "total") {
        return filterAirtData
      } else if (typeof param === "object"  && param.sitename) {
        const targetData = filterAirtData.find(
          (item) =>  item.sitename === param.sitename
        );
        return targetData || null;
      } else {
        throw new Error("無效的參數格式");
      }
    } else {
      throw new Error("回傳資料不完整");
    }
  } catch (error) {
    return { error: true };
  }
}

// console.log(getAirData("total"));
// console.log(getAirData({sitename:"基隆"}));


