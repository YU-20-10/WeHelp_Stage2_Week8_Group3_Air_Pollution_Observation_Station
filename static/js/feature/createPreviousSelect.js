import { getCountyAndStation } from "../function/getCountyAndStation.js";

export async function createPreviousSelect(currentData = false){
    const countySelect = document.getElementById('county-select');

    // 建立選項
    let counties = await getCountyAndStation("county");
    // console.log('input 內的',counties)

    counties.forEach((county) => {
        let option = document.createElement("option");
        option.value = county;
        option.textContent = county;
        countySelect.appendChild(option);
    });

    let siteSelect = document.getElementById("site-select");
    siteSelect.innerHTML = "";

    // 預選縣市
    // console.log("資料",currentData)
    const defaultCounty = currentData ? currentData.county : '新北市';
    countySelect.value = defaultCounty;
    await renderSiteChip(currentData, { target: { value: defaultCounty } });


    // 監聽選擇的縣市
    countySelect.addEventListener("change", async (event) => {
        await renderSiteChip(currentData, event)
    });

}

async function renderSiteChip(currentData = false, event){
    // 取得縣市資料
    const selectedCounty = event.target.value;
    const stationData = await getCountyAndStation({ county: selectedCounty });
    // console.log("該縣市的測站資料：", stationData);

    // 取得容器DOM
    let siteSelect = document.getElementById("site-select");

    // 若有舊的SiteDom，要先移除
    siteSelect.innerHTML = "";

    // console.log(stationData)
    // console.log(currentData)

    let isCurrentSiteInList = false 
    // 渲染該縣市的監測站
    stationData.forEach((item) => {
        let newSiteData = document.createElement("button");
        newSiteData.textContent = item.sitename;
        newSiteData.id = `site-select-${item.siteid}`;
        newSiteData.className = "chip text-sm-500 site-select-option";
        siteSelect.appendChild(newSiteData);
        if (currentData && currentData.siteid === item.siteid){
            isCurrentSiteInList = true
        }
    });
    if (isCurrentSiteInList){
        const currentSiteId = document.getElementById(`site-select-${currentData.siteid}`);
        currentSiteId.classList.add('chip-active');
        if (currentSiteId) {
            currentSiteId.classList.add("chip-active");
        }
    }else{
        const firstSiteSelect = siteSelect.querySelector(".chip");
        if (firstSiteSelect) {
            firstSiteSelect.classList.add("chip-active");
        }
    }
}


