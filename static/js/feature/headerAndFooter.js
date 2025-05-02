export async function renderHeaderAndFooter(){
    try{
        const header = await fetch("/static/header.html");
        const html = await header.text();
        document.body.insertAdjacentHTML('afterbegin', html);
    }
    catch(error){
        console.error('Error fetching data:', error);
    }

    const footer = document.createElement('footer');
    footer.innerHTML = `
        <div class='footer-text text-sm-400'>
            <p id="status">正在偵測位置並推播最近測站...</p>
            <p>COPYRIGHT @ 2025</p>
        </div>
        `
    document.body.appendChild(footer);

    document.querySelector('#header-logo').addEventListener('click', ()=>{
        window.location.href='/';
    })

    rwdHeader();
}

function rwdHeader(){
    const hideHeaderText = document.querySelector('#header-logo h3');
    const isMobileScreen = window.matchMedia('(max-width: 601px)').matches;
    if (isMobileScreen){
        hideHeaderText.style.display = 'none';
    }else{
        hideHeaderText.style.display = 'block';
    }
}

// 自動定位與推播
export function getGeolocation(){
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            document.getElementById("status").textContent = "此瀏覽器不支援定位。";
            resolve(null);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const lat = coords.latitude;
                const lon = coords.longitude;
                document.getElementById("status").textContent =
                `偵測到位置：${lat.toFixed(5)}, ${lon.toFixed(5)}，搜尋中...`;
                fetch(`/auto_notify?lat=${lat}&lon=${lon}`)
                .then(res => res.json())
                .then(json => {
                    const locationData = json.data;
                    const county = locationData.county || "";
                    const sitename = locationData.sitename || "";
                    const aqi = locationData.aqi || "";
                    if (aqi){
                        document.getElementById("status").textContent = 
                            `最近測站：${county}/${sitename}，當前 AQI: ${aqi}`;
                    }else{
                        document.getElementById("status").textContent = 
                        `最近測站：${county}/${sitename}`;
                    }
                    // console.log("get locationData",locationData)
                    resolve(locationData); //{sitename: '豐原', county: '臺中市', siteid: '28', aqi: '73'}
                })
                .catch(err => {
                    // console.error(err);
                    document.getElementById("status").textContent = "自動偵測失敗，請手動選取探測站";
                    resolve(null);
                });

            },
            err => {
                // console.error(err);
                document.getElementById("status").textContent = "無法取得位置，請允許定位或手動選取探測站。";
                resolve(null);
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    })
}


window.addEventListener('resize', rwdHeader);
