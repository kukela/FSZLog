function initTestData() {
//   wx.clearStorageSync()
//   const t_2023_8 = {
//     budget: 3000,
//     listS: ``
//   }
//   const t_2023_9 = {
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
//   wx.setStorageSync("md-2023-08", JSON.stringify(t_2023_8))
//   wx.setStorageSync("md-2023-09", JSON.stringify(t_2023_9))
//   wx.setStorageSync("md-2023-12", JSON.stringify(t_2023_9))
//   wx.setStorageSync("md-2024-02", JSON.stringify(t_2024_02))
//   wx.setStorageSync("md-2024-03", JSON.stringify(t_2024_03))
//   const tags = [
//     { tt: "京东", t: 1710554711754 },
//     { tt: "支付宝", t: 1710554711754 },
//     { tt: "ABC_1", t: 1710554711754 }
//   ]
//   wx.setStorageSync("tags", JSON.stringify(tags))

  // wx.removeStorageSync("md-2024-03")

  // const ioStr = `
  // ABC | 2024-03-01 12:01:01 | -1000.10
  // ABCd | 2024-03-02 12:01:03 | +100
  // `

  // wx.removeStorageSync("installment")
//   wx.removeStorageSync("installmentC")
//   const testIM = `
// 1 | 贷款1 | 10000 | 等额本息_3.99 | 36 | 2024-01-11 | 2024-02 | 202403_1000_1,202601_2000_1,202610_505_1
// 2 | 贷款2 | 10000 | 等额本金_3.99 | 36 | 2022-11-11 | 2023-02 | 202503_2000_1
// 4 | 自行车2 | 598.8 | 免息 | 13 | 2023-12-11 | 2024-01
// 7 | 自行车5 | 611 | 免息 | 3 | 2024-04-11 | 2024-05
//   `
//   const testIM2 = `
// 3 | 自行车1 | 598.8 | 免息 | 12 | 2023-12-11 | 2024-01 | 202403_499_1
// 5 | 自行车3 | 601 | 免息 | 10 | 2023-03-11 | 2023-04
// 6 | 自行车4 | 601 | 免息 | 10 | 2023-03-11 | 2023-04
//   `
//   wx.setStorageSync("installment", testIM + testIM2)
}

module.exports = {
  initTestData
}