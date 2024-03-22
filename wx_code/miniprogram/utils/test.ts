function initTestData() {
  // wx.clearStorageSync()
  // const ydata = [{
  //   date: "2024-03",
  //   budget: 3000,
  //   list: [
  //     { tt: "京东", p: "-100", t: "01 18:00:01" },
  //     { tt: "支付宝", p: "-1000.1", t: "02 18:00:01" },
  //     { tt: "京东", p: "-101", t: "03 18:00:01" }
  //   ]
  // }]
  // wx.setStorageSync("ydata-2024", JSON.stringify(ydata))

//   wx.clearStorageSync()
//   const t_2023_11 = {
//     budget: 3000,
//     listS: ``
//   }
//   const t_2023_12 = {
//     budget: 3000,
//     listS: `ABCd | -4000 | 10 18:00:01`
//   }
//   const t_2024_02 = {
//     budget: 3000,
//     listS: `ABCd | -4000 | 10 18:00:01`
//   }
//   const t_2024_03 = {
//     budget: 3000,
//     listS: `
// 京东 | -100 | 01 18:00:01
// 支付宝 | -1000.1 | 02 12:01:01
// 京东 | +100 | 03 15:03:01
// 京东 | -100 | 04 17:24:01
// ABC_1 | -100 | 01 18:00:01`
//   }
//   wx.setStorageSync("md-2023-11", JSON.stringify(t_2023_11))
//   wx.setStorageSync("md-2023-12", JSON.stringify(t_2023_12))
//   wx.setStorageSync("md-2024-02", JSON.stringify(t_2024_02))
//   wx.setStorageSync("md-2024-03", JSON.stringify(t_2024_03))
  // const tags = [
  //   { tt: "京东", t: 1710554711754 },
  //   { tt: "支付宝", t: 1710554711754 },
  //   { tt: "ABC_1", t: 1710554711754 }
  // ]
  // wx.setStorageSync("tags", JSON.stringify(tags))

  // wx.removeStorageSync("md-2024-03")

  // const ioStr = `
  // ABC | 2024-03-01 12:01:01 | -1000.10
  // ABCd | 2024-03-02 12:01:03 | +100
  // `

  // wx.removeStorageSync("installment")
  
//   wx.removeStorageSync("installmentC")
//   const testIM = `
// 1 | 贷款 | 40000 | 等额本息_3.99 | 36 | 2024-01-11 | 2024-01
// 2 | 贷款 | 40000 | 等额本金_3.99 | 36 | 2024-01-11 | 2024-01
// 3 | 自行车1 | 598.8 | 免息 | 12 | 2023-12-11 | 2024-01
// 4 | 自行车2 | 598.8 | 免息 | 13 | 2023-12-11 | 2024-01
// 5 | 自行车3 | 601 | 免息 | 6 | 2023-03-11 | 2023-04
// 6 | 自行车4 | 601 | 免息 | 7 | 2023-03-11 | 2023-04
// 7 | 自行车55 | 611 | 免息 | 3 | 2024-03-11 | 2024-04
//   `
//   wx.setStorageSync("installment", testIM)
}

module.exports = {
  initTestData
}