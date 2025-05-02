import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as topojson from "https://cdn.jsdelivr.net/npm/topojson@3/+esm";
import { getCountyAndStation } from "../function/getCountyAndStation.js";
import { getAirData } from "../function/getAirData.js";
import { renderStationAirDataDom } from "./renderStationAirData.js";
import { renderCountyStations } from "./onStationListClick.js";

function taiwanMap() {
  const model = {
    hoverCountry: {},
    clickCountry: {},
    d3: { svg: {}, topoData: {}, geoData: {}, projection: {}, path: {} },
    allStationData: {},
    stationDataByCountry: {},
    statusColor: {
      良好: "var(--color-primary-400)",
      普通: "var(--color-primary-600)",
      對敏感族群不健康: "var(--color-yellow-400)",
      對所有族群不健康: "var(--color-yellow-600)",
      不健康: "var(--color-red-400)",
      危險: "var(--color-red-800)",
      偵測中: "var(--color-zinc-600)",
      undefined: "var(--color-zinc-600)",
    },
    organizeStationData: function () {
      model.allStationData.forEach((stationData) => {
        const exit = this.stationDataByCountry[stationData.county];
        exit
          ? this.stationDataByCountry[stationData.county].push(stationData)
          : (this.stationDataByCountry[stationData.county] = [stationData]);
      });
    },
  };
  const view = {
    createDiv: (dom) => {
      const div = document.createElement("div");
      return dom.appendChild(div);
    },
    createTaiwan: async (dom, status) => {
      const width = 600;
      const height = 800;
      model.d3.svg = d3
        .create("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("width", "100%")
        .attr("height", "100%");

      model.d3.topoData = await d3.json("/static/map/county.topojson");

      model.d3.geoData = topojson.feature(
        model.d3.topoData,
        model.d3.topoData.objects.county
      );
      model.d3.projection = d3
        .geoMercator()
        .center([121, 24]) // 台灣中心的經緯度
        .scale(8000)
        .translate([width / 1.5, height / 2]);

      // .geoPath()將地理資料轉換成SVG使用的d屬性字串
      model.d3.path = d3.geoPath().projection(model.d3.projection);

      model.d3.svg
        .selectAll("path")
        .data(model.d3.geoData.features)
        .enter()
        .append("path")
        .attr("d", model.d3.path)
        .attr("data-county", (d) => d.properties.COUNTYNAME)
        .style("fill", "var(--color-zinc-400)")
        .style("stroke", "white")
        .style("stroke-width", 1)
        .on("mouseover", function (event) {
          const countyName = this.dataset.county;
          model.hoverCountry = d3.select(this);
          d3.select(this).style("fill", "var(--color-zinc-500)");
        })
        .on("mouseout", function () {
          d3.select(this).style("fill", "var(--color-zinc-400)");
          model.hoverCountry = {};
        })
        .on("click", function () {
          model.clickCountry = d3.select(this);
        });

      requestAnimationFrame(() => {
        view.createBorder("連江");
        view.createBorder("澎湖");
      });

      dom.appendChild(model.d3.svg.node());
    },
    createBorder: (nodeName) => {
      const correctedName = model.d3.geoData.features.find((d) =>
        d.properties.COUNTYNAME.includes(nodeName)
      )?.properties.COUNTYNAME;
      const targetPath = model.d3.svg.select(
        `path[data-county="${correctedName}"]`
      );
      if (targetPath.node()) {
        const bbox = targetPath.node().getBBox();

        const group = model.d3.svg.append("g").attr("class", "highlight-group");

        group
          .append("rect")
          .attr("x", bbox.x - 5)
          .attr("y", bbox.y - 5)
          .attr("width", bbox.width + 10)
          .attr("height", bbox.height + 10)
          .attr("data-county", `${nodeName}縣`)
          .style("stroke", "var(--color-zinc-400)")
          .attr("stroke-width", 1)
          .style("fill", "transparent")
          .on("mouseover", function (event) {
            const countyName = this.dataset.county;
            model.hoverCountry = d3.select(this);
            d3.select(this).style("fill", "var(--color-zinc-500)");
          })
          .on("mouseout", function () {
            d3.select(this).style("fill", "transparent");
            model.hoverCountry = {};
          })
          .on("click", function () {
            model.clickCountry = d3.select(this);
          });

        // 複製原本的 path 並加進這個 group
        const cloned = targetPath.node().cloneNode();
        group.node().appendChild(cloned);
      }
    },
    createHint: (dom) => {
      const ul = document.createElement("ul");
      ul.style.padding = "12px";
      const data = [
        ["偵測中", model.statusColor["偵測中"]],
        ["危險", model.statusColor["危險"]],
        ["不健康", model.statusColor["不健康"]],
        ["對所有族群不健康", model.statusColor["對所有族群不健康"]],
        ["對敏感族群不健康", model.statusColor["對敏感族群不健康"]],
        ["普通", model.statusColor["普通"]],
        ["良好", model.statusColor["良好"]],
      ];
      data.forEach((el) => {
        let li = document.createElement("li");
        let text = document.createTextNode(el[0]);
        li.appendChild(text);
        li.style.borderLeft = `6px solid ${el[1]}`;
        li.style.paddingLeft = "10px";
        ul.appendChild(li);
      });
      dom.appendChild(ul);
    },
    createStation: (stationData, status) => {
      const [x, y] = model.d3.projection([
        stationData.longitude,
        stationData.latitude,
      ]);
      model.d3.svg
        .append("circle")
        .attr("class", "taiwan-map-station")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 8)
        .attr("data-stationCounty", stationData.county)
        .attr("data-stationSitename", stationData.sitename)
        .attr("fill", model.statusColor[status])
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .each(function (d) {
          d3.select(this).append("title").text(stationData.sitename);
        })
        .on("click", function () {
          const siteName = this.dataset.stationSitename;
          renderStationAirDataDom(siteName);
          if (window.innerWidth < 992) {
            const target = document.querySelector(".airDataWrapper");
            target.scrollIntoView({ behavior: "smooth" });
          }
        });
    },
    createCountryName: (d3Select) => {
      const bbox = d3Select.node().getBBox();
      let textNode = null;
      if (d3Select.node().dataset.county === "高雄市") {
        const bounds = model.d3.path.bounds(
          model.d3.geoData.features.find(
            (f) => f.properties.COUNTYNAME === "高雄市"
          )
        );
        const [x0, y0] = bounds[0];
        const [x1, y1] = bounds[1];

        textNode = model.d3.svg
          .append("text")
          .attr("class", "taiwan-map-country-name")
          .attr("x", x1 / 1.5 - 20)
          .attr("y", y0 * 1.2 + 10)
          .text(d3Select.node().dataset.county)
          .attr("font-size", "12px")
          .style("fill", "var(--color-primary-500)");
      } else if (d3Select.node().dataset.county === "宜蘭縣") {
        textNode = model.d3.svg
          .append("text")
          .attr("class", "taiwan-map-country-name")
          .attr("x", bbox.x + bbox.width / 5)
          .attr("y", bbox.y + bbox.height / 1.2)
          .text(d3Select.node().dataset.county)
          .attr("font-size", "12px")
          .style("fill", "var(--color-primary-500)");
      } else if (d3Select.node().dataset.county === "金門縣") {
        textNode = model.d3.svg
          .append("text")
          .attr("class", "taiwan-map-country-name")
          .attr("x", bbox.x + bbox.width / 2)
          .attr("y", bbox.y + bbox.height / 1.2)
          .text(d3Select.node().dataset.county)
          .attr("font-size", "12px")
          .style("fill", "var(--color-primary-500)");
      } else {
        textNode = model.d3.svg
          .append("text")
          .attr("class", "taiwan-map-country-name")
          .attr("x", bbox.x + bbox.width / 1.5 + 10)
          .attr("y", bbox.y + bbox.height / 1.5)
          .text(d3Select.node().dataset.county)
          .attr("font-size", "12px")
          .style("fill", "var(--color-primary-500)");
      }
      const textbbox = textNode.node().getBBox();

      model.d3.svg
        .insert("rect", "text")
        .attr("class", "taiwan-map-name-bg")
        .attr("x", textbbox.x - 4)
        .attr("y", textbbox.y - 2)
        .attr("width", textbbox.width + 8)
        .attr("height", textbbox.height + 4)
        .style("fill", "var(--color-zinc900-60)")
        .attr("rx", 8);
    },
  };
  const controller = {
    init: async () => {
      const main = document.querySelector("main");
      const container = view.createDiv(main);
      container.classList.add("taiwan-map-container");
      const taiwanContainer = view.createDiv(container);
      taiwanContainer.classList.add("taiwan-map-taiwan");
      const hint = view.createDiv(container);
      hint.classList.add("taiwan-map-hint");
      view.createHint(hint);
      await view.createTaiwan(taiwanContainer);
      model.allStationData = await getAirData("total");
      model.organizeStationData();
      model.allStationData.forEach((el) => {
        view.createStation(el, el.status);
      });

      taiwanContainer.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (e.target.dataset.county) {
          const countyName = e.target.dataset.county;
          controller.clickHandler(countyName);
          const countySelect = document.getElementById("countySelect");
          countySelect.value = countyName;
          renderCountyStations(countyName);
        }
      });
    },
    clickHandler: (county) => {
      const path = d3.select(`path[data-county="${county}"]`);
      if (path) {
        model.d3.svg.selectAll(".taiwan-map-country-name").remove();
        model.d3.svg.selectAll(".taiwan-map-name-bg").remove();
        view.createCountryName(path);
        model.d3.svg.selectAll("*").classed("taiwan-map-select", false);
        path.attr("class", "taiwan-map-select");
        model.d3.svg.selectAll("circle.taiwan-map-station").remove();
        let stationData = model.stationDataByCountry[county];
        stationData.forEach(async (el) => {
          view.createStation(el, el.status);
        });
        if (window.innerWidth < 992) {
          let target = document.querySelector(".airData");
          let targetDisplay = target.classList.contains("display-none");
          const summary = document.querySelector(
            ".airData__stationDataHead__summary"
          );
          if (!target | targetDisplay) {
            target = document.querySelector(".airDataWrapper");
          }
          if (summary) {
            document.querySelector(".airData").classList.remove("display-none");
            document
              .querySelector("main")
              .removeChild(document.querySelector(".airDataWrapper"));
            target = document.querySelector(".airData");
          }
          target.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        console.log("county輸入錯誤");
      }
    },
  };

  return controller;
}

export default taiwanMap();
