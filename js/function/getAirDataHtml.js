import { getAqiColor } from "./getAqiColorAndImgUrl.js";

export function getAirDataHtml(airDataAnalyze) {
  let airDataHTML = "";
  airDataAnalyze.forEach((item, index) => {
    let airDataClass =
      index % 2 === 0
        ? "airData__content__item--even"
        : "airData__content__item--odd";

    if (item.avgKey) {
      airDataHTML += `
              <div class="${airDataClass}">
                  <div class="item__title">
                      <p class="item__title__EngTitle text-2xl-700">${item.key}</sub></p>
                      <p class="item__title__ChiTitle text-base-500">${item.subtitle}</p>
                  </div>
                  <div class="item__data">
                      <div class="item__data__row">
                          <p class="row__title text-base-500">${item.avgTitle}</p>
                          <p class="row__score text-2xl-700 ${getAqiColor(item.key, item.avgConcen)}" >${item.avgConcen}</p>
                          <p class="row__unit text-sm-500">${item.unit}</p>
                      </div>
                      <div class="item__data__hr"></div>
                      <div class="item__data__row">
                          <p class="row__title text-base-500">小時濃度</p>
                          <p class="row__score text-2xl-700 ${getAqiColor(item.key, item.concen)}">${item.concen}</p>
                          <p class="row__unit text-sm-500">${item.unit}</p>
                      </div>
                  </div>
              </div>
          `;
    } else {
      airDataHTML += `
              <div class="${airDataClass}">
                  <div class="item__title">
                      <p class="item__title__EngTitle text-2xl-700">${item.key}</sub></p>
                      <p class="item__title__ChiTitle text-base-500">${item.subtitle}</p>
                  </div>
                  <div class="item__data">
                      <div class="item__data__row">
                          <p class="row__title text-base-500">小時濃度</p>
                          <p class="row__score text-2xl-700 ${getAqiColor(item.key, item.concen)}">${item.concen}</p>
                          <p class="row__unit text-sm-500">${item.unit}</p>
                      </div>
                  </div>
              </div>
          `;
    }
  });
  return airDataHTML
}
