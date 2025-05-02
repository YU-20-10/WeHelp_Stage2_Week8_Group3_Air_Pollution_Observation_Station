import { getChartData } from "../function/renderChartData.js";

export function confirmPreviousSelect(){
    initSiteChips();
    initSubindexChips();
    document.getElementById('confirm-select').addEventListener('click', collectSelect)
}

let initSubindexChipsIsListening = false;
let initSiteChipsIsListening = false;
let initSiteChipsAllIsListening = false;


// 選擇探測站（chip 單選）
function initSiteChips() {
    const siteSelect = document.getElementById('site-select');
  
    if(!initSiteChipsIsListening){
        siteSelect.addEventListener('click', (event) => {
            const target = event.target;
            const activeChips = siteSelect.querySelector('.chip-active'); 

            if (!target.classList.contains('chip')) return;

            activeChips.classList.remove('chip-active');
            target.classList.add('chip-active');
        });
        initSiteChipsIsListening = true;
    }
}

//選擇觀測項目（chip 多選）
function initSubindexChips() {
    const subindexSelectAll = document.getElementById('subindex-select-all');
    const subindexSelect = document.getElementById('subindex-select');
    const chips = subindexSelect.querySelectorAll('.chip');

    if(!initSiteChipsAllIsListening){
        subindexSelectAll.addEventListener('click', ()=>{
            if (subindexSelectAll.textContent === '全選'){
                chips.forEach(item => {
                    item.classList.add('chip-active');
                });
                subindexSelectAll.textContent = '取消全選';
            } else{
                chips.forEach(item => {
                    item.classList.remove('chip-active');
                });
                chips[0].classList.add('chip-active');
                subindexSelectAll.textContent = '全選';
            }

        })

        initSiteChipsAllIsListening = true;
    }
  
    if(!initSubindexChipsIsListening){
        subindexSelect.addEventListener('click', (event) => {
            const target = event.target;

            if (!target.classList.contains('chip')) return;

            const activeChips = subindexSelect.querySelectorAll('.chip-active'); //查看總共幾個
            const isActive = target.classList.contains('chip-active'); //該選項是否 active
            // console.log(target)
            // console.log(activeChips)
            // console.log(isActive)
            
            // 如果目前只有一個 chip-active 且點擊的是它本人，禁止取消
            if (isActive && activeChips.length === 1 && activeChips[0] === target) {
                return;
            }

            target.classList.toggle('chip-active');
        });
        initSubindexChipsIsListening = true;
    }
}

function collectSelect(){
    const countySelect = document.getElementById('county-select');
    const siteFinalSelect = document.querySelector('#site-select .chip-active'); 
    const subindexFinalSelect = document.querySelectorAll('#subindex-select .chip-active'); 

    const countyFinalSelect = countySelect.value;
    const siteFinalId = siteFinalSelect.id.split('-')[2];
    const subindexFinalIds = Array.from(subindexFinalSelect).map((item) => item.id.split('-')[2]);
    // console.log(countyFinalSelect, siteFinalId, subindexFinalIds); 

    getChartData(countyFinalSelect, siteFinalId, subindexFinalIds);//新北市, 9 ,['AQI', 'PM25', 'NO2']
}