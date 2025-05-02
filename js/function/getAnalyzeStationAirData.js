export function getAnaylyzeStationAirData(stationAirData) {
  let airDataAnalyze = [
    {
      key: "O3",
      subtitle: "臭氧",
      concen: stationAirData.o3,
      unit: "ppb",
      avgKey: "o3_8hr",
      avgTitle: "8 小時平均濃度",
      avgConcen: stationAirData.o3_8hr,
    },
    {
      key: "PM2.5",
      subtitle: "細懸浮微粒",
      concen: stationAirData["pm2.5"],
      unit: "μg/m3",
      avgKey: "pm2.5_avg",
      avgTitle: "平均濃度",
      avgConcen: stationAirData["pm2.5_avg"],
    },
    {
      key: "PM10",
      subtitle: "懸浮微粒",
      concen: stationAirData.pm10,
      unit: "μg/m3",
      avgKey: "pm10_avg",
      avgTitle: "平均濃度",
      avgConcen: stationAirData.pm10_avg,
    },
    {
      key: "CO",
      subtitle: "一氧化碳",
      concen: stationAirData.co,
      unit: "ppm",
      avgKey: "co_8hr",
      avgTitle: "8 小時平均濃度",
      avgConcen: stationAirData.co_8hr,
    },
    {
      key: "SO2",
      subtitle: "二氧化硫",
      concen: stationAirData.so2,
      unit: "ppb",
      avgKey: "so2_avg",
      avgTitle: "平均濃度",
      avgConcen: stationAirData.so2_avg,
    },
    // {
    //   key: "NO",
    //   subtitle: "一氧化氮",
    //   concen: stationAirData.no,
    //   unit: "ppb",
    // },
    {
      key: "NO2",
      subtitle: "二氧化氮",
      concen: stationAirData.no2,
      unit: "ppb",
    },
  ];
  return airDataAnalyze;
}
