export function getAqiBackgroundColor(AQIScore) {
  if (AQIScore <= 50) {
    return "backgroundColor--lightGreen";
  } else if (AQIScore >= 51 && AQIScore <= 100) {
    return "backgroundColor--darkGreen";
  } else if (AQIScore >= 101 && AQIScore <= 150) {
    return "backgroundColor--lightYellow";
  } else if (AQIScore >= 151 && AQIScore <= 200) {
    return "backgroundColor--darkYellow";
  } else if (AQIScore >= 201 && AQIScore <= 300) {
    return "backgroundColor--lightRed";
  } else {
    return "backgroundColor--darkRed";
  }
}

export function getAqiDisdordBackgroundColor(AQIScore) {
  if (AQIScore <= 50) {
    return "airData__discord__btn--lightGreen";
  } else if (AQIScore >= 51 && AQIScore <= 100) {
    return "airData__discord__btn--darkGreen";
  } else if (AQIScore >= 101 && AQIScore <= 150) {
    return "airData__discord__btn--lightYellow";
  } else if (AQIScore >= 151 && AQIScore <= 200) {
    return "airData__discord__btn--darkYellow";
  } else if (AQIScore >= 201 && AQIScore <= 300) {
    return "airData__discord__btn--lightRed";
  } else {
    return "airData__discord__btn--darkRed";
  }
}

export function getAqiColor(gasName, AQIScore) {
  // O3分級顏色
  if (gasName === "O3") {
    if (AQIScore <= 54) {
      return "color--lightGreen";
    } else if (AQIScore >= 55 && AQIScore <= 70) {
      return "color--darkGreen";
    } else if (AQIScore >= 71 && AQIScore <= 85) {
      return "color--lightYellow";
    } else if (AQIScore >= 86 && AQIScore <= 105) {
      return "color--darkYellow";
    } else if (AQIScore >= 106 && AQIScore <= 200) {
      return "color--lightRed";
    } else {
      return "color--darkRed";
    }
  }
  // PM2.5分級顏色
  else if (gasName === "PM2.5") {
    if (AQIScore <= 15.4) {
      return "color--lightGreen";
    } else if (AQIScore >= 15.5 && AQIScore <= 35.4) {
      return "color--darkGreen";
    } else if (AQIScore >= 35.5 && AQIScore <= 54.5) {
      return "color--lightYellow";
    } else if (AQIScore >= 54.5 && AQIScore <= 150.4) {
      return "color--darkYellow";
    } else if (AQIScore >= 150.5 && AQIScore <= 250.4) {
      return "color--lightRed";
    } else {
      return "color--darkRed";
    }
  }
  // PM10分級顏色
  else if (gasName === "PM10") {
    if (AQIScore <= 50) {
      return "color--lightGreen";
    } else if (AQIScore >= 51 && AQIScore <= 100) {
      return "color--darkGreen";
    } else if (AQIScore >= 101 && AQIScore <= 254) {
      return "color--lightYellow";
    } else if (AQIScore >= 255 && AQIScore <= 354) {
      return "color--darkYellow";
    } else if (AQIScore >= 355 && AQIScore <= 424) {
      return "color--lightRed";
    } else {
      return "color--darkRed";
    }
  }
  // CO分級顏色
  else if (gasName === "CO") {
    if (AQIScore <= 4.4) {
      return "color--lightGreen";
    } else if (AQIScore >= 4.5 && AQIScore <= 9.4) {
      return "color--darkGreen";
    } else if (AQIScore >= 9.5 && AQIScore <= 12.4) {
      return "color--lightYellow";
    } else if (AQIScore >= 12.5 && AQIScore <= 15.4) {
      return "color--darkYellow";
    } else if (AQIScore >= 15.5 && AQIScore <= 30.4) {
      return "color--lightRed";
    } else {
      return "color--darkRed";
    }
  }
  // SO2分級顏色
  else if (gasName === "SO2") {
    if (AQIScore <= 20) {
      return "color--lightGreen";
    } else if (AQIScore >= 21 && AQIScore <= 75) {
      return "color--darkGreen";
    } else if (AQIScore >= 76 && AQIScore <= 185) {
      return "color--lightYellow";
    } else if (AQIScore >= 186 && AQIScore <= 304) {
      return "color--darkYellow";
    } else if (AQIScore >= 305 && AQIScore <= 604) {
      return "color--lightRed";
    } else {
      return "color--darkRed";
    }
  }
  // NO2分級顏色
  else if (gasName === "NO2") {
    if (AQIScore <= 30) {
      return "color--lightGreen";
    } else if (AQIScore >= 31 && AQIScore <= 100) {
      return "color--darkGreen";
    } else if (AQIScore >= 101 && AQIScore <= 360) {
      return "color--lightYellow";
    } else if (AQIScore >= 361 && AQIScore <= 649) {
      return "color--darkYellow";
    } else if (AQIScore >= 650 && AQIScore <= 1249) {
      return "color--lightRed";
    } else {
      return "color--darkRed";
    }
  }
}

export function getAqiImgUrl(AQIScore) {
  if (AQIScore <= 50) {
    return "../static/image/good.png";
  } else if (51 <= AQIScore <= 100) {
    return "../static/image/soso.png";
  } else if (101 <= AQIScore <= 300) {
    return "../static/image/bad.png";
  } else {
    return "../static/image/popo.png";
  }
}
