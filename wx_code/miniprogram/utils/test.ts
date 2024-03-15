function initTestData() {
  // wx.clearStorageSync()
  // let ydata = [{
  //   date: "2024-03",
  //   budget: 3000,
  //   list: [
  //     { tt: "京东", p: "-100", t: "01 18:00:01" },
  //     { tt: "支付宝", p: "-1000.1", t: "02 18:00:01" },
  //     { tt: "京东", p: "-101", t: "03 18:00:01" }
  //   ]
  // }]
  // wx.setStorageSync("ydata-2024", JSON.stringify(ydata))

  // wx.clearStorageSync()
  // let t_2023_11 = {
  //   budget: 3000,
  //   listS: ``
  // }
  // let t_2023_12 = {
  //   budget: 3000,
  //   listS: `ABCd | -4000 | 10 18:00:01`
  // }
  // let t_2024_02 = {
  //   budget: 3000,
  //   listS: `ABCd | -4000 | 10 18:00:01`
  // }
  // let t_2024_03 = {
  //   budget: 3000,
  //   listS: `
  // 京东 | -100 | 01 18:00:01
  // 支付宝 | -1000.1 | 02 12:01:01
  // 京东 | +100 | 03 15:03:01
  // 京东 | -100 | 04 17:24:01
  // ABC_1 | -100 | 01 18:00:01`
  // }
  // wx.setStorageSync("md-2023-11", JSON.stringify(t_2023_11))
  // wx.setStorageSync("md-2023-12", JSON.stringify(t_2023_12))
  // wx.setStorageSync("md-2024-02", JSON.stringify(t_2024_02))
  // wx.setStorageSync("md-2024-03", JSON.stringify(t_2024_03))

  // wx.removeStorageSync("md-2024-03")

  // let ioStr = `
  // ABC | 2024-03-01 12:01:01 | -1000.10
  // ABCd | 2024-03-02 12:01:03 | +100
  // `

  let testIM = `
-$installment- | 贷款 | 40000 | ELP | 3.99 | 36 | 2024-03-11 | 2024-04
-$installment- | 自行车 | 40000 | IFE | 0 | 12 | 2024-03-11 | 2024-04
  `
  wx.setStorageSync("installment", testIM)
  // wx.removeStorageSync("installment")
}

module.exports = {
  initTestData
}