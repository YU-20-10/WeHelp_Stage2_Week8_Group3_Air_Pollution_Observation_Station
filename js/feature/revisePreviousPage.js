export function revisePreviousPage(){
    const mainPageBtn = document.getElementById('main-page-btn');
    mainPageBtn.style.display = "flex";
    mainPageBtn.addEventListener('click', ()=>{
        window.location.href='/';
    })
}