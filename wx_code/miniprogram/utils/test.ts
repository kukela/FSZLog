function initTestData() {
  let test2023 = `
  [
    {
      "date": "2023-11",
      "budget": 3000,
      "list": []
    }, {
      "date": "2023-12",
      "budget": 3000,
      "list": [
        {"tt": "ABCd", "t": "10 18:00:01", "p": "-4000"}
      ]
    }
  ]`
  let test2024 = `
  [
    {
      "date": "2024-03",
      "budget": 3000,
      "list": [
        {"tt": "ABC", "t": "01 18:00:01", "p": "-100"},
        {"tt": "ABC", "t": "02 12:01:01", "p": "-1000.10"},
        {"tt": "ABC", "t": "03 15:03:01", "p": "+100"},
        {"tt": "ABC", "t": "04 17:24:01", "p": "-100"},
        {"tt": "ABC_1", "t": "01 18:00:01", "p": "-100"},
        {"tt": "ABC_2", "t": "01 18:00:01", "p": "-1000"},
        {"tt": "ABC_3", "t": "01 18:00:01", "p": "+100"}
      ]
    }, {
      "date": "2024-02",
      "budget": 3000,
      "list": [
        {"tt": "ABCd", "t": "10 18:00:01", "p": "-4000"}
      ]
    }
  ]`
  // wx.setStorageSync("ydata-2023", test2023)
  // wx.setStorageSync("ydata-2024", test2024)
  // wx.setStorageSync("ydata-2025", undefined)
  // wx.removeStorageSync("ydata-2025")
  // wx.removeStorageSync("ydata-2024")
  // wx.removeStorageSync("ydata-2023")

  // let ioStr = `
  // ABC | 2024-03-01 12:01:01 | -1000.10
  // ABCd | 2024-03-02 12:01:03 | +100
  // `
}

module.exports = {
  initTestData
}