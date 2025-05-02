export const getCountyAndStation = async (param) => {
  try {
    let response = await fetch(
      "https://data.moenv.gov.tw/api/v2/aqx_p_07?api_key=b68831b5-fc06-4223-879c-9d92b9d4d293"
    );
    let data = await response.json();

    // 如果fetch到的資料包含所有測站資料，進行以下
    if (data.include_total === true) {
      let stationData = data.records.sort((a, b) => a.siteid - b.siteid); //stationData為一個陣列，包含所有測站的基本資料，排序依照siteid

      // 根據不同參數給出不同資料

      // 參數為county，給出資料為縣市，並照監測站siteid排序
      if (param === "county") {
        let countySet = new Set();
        let countyData = stationData
          .filter((item) => {
            if (countySet.has(item.county)) {
              return false;
            } else {
              countySet.add(item.county);
              return true;
            }
          })
          .map((item) => item.county);
        return countyData;
      } else if (typeof param === "object" && param.county) {
        if (param.county === "total") {
          return stationData;
        } else {
          const targetData = stationData.filter(
            (item) => item.county === param.county
          );
          return targetData || null;
        }
      } else {
        throw new Error("無效的參數格式");
      }
    } else {
      throw new Error("回傳資料不完整");
    }
  } catch (error) {
    return { error: true };
  }
};

// console.log(getCountyAndStation("county"));
// console.log(getCountyAndStation({ county: "新北市" }));
// console.log(getCountyAndStation({ county: "total" }))
