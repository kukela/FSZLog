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
      "list": [{
        "name": "ABC",
        "list": [
          {"t": "10 18:00", "p": "-4000"}
        ]
      }]
    }
  ]`
  let test2024 = `
  [
    {
      "date": "2024-2",
      "budget": 3000,
      "list": [
      {
        "name": "ABC",
        "list": [
          {"t": "10 18:00", "p": "-100"},
          {"t": "12 12:01", "p": "-1000.1"},
          {"t": "13 15:03", "p": "+100"},
          {"t": "14 17:24", "p": "-100"}
        ]
      }, {
        "name": "ABC_1",
        "list": [
          {"t": "10 18:00", "p": "-100"}
        ]
      }, {
        "name": "ABC_2",
        "list": [
          {"t": "10 18:00", "p": "-1000"}
        ]
      }, {
        "name": "ABC_3",
        "list": [
          {"t": "10 18:00", "p": "+100"}
        ]
      }
    ]}
  ]`
  wx.setStorageSync("ydata-2023", test2023)
  wx.setStorageSync("ydata-2024", test2024)
  // wx.setStorageSync("ydata-2025", test2024)
}

module.exports = {
  initTestData
}