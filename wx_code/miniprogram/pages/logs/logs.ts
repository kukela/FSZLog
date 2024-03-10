import dataU from '../../utils/data.js'

Page({
  data: {
    date: '',
    startDate: '',
    endDate: '',
    list: <any>[],
    importM: {
      show: false,
      list: <any>[],
    }
  },
  lifetimes: {
    attached: function () {
    }
  },
  onShow() {
    this.refPageData(dataU.getDefYear())
  },
  onShareAppMessage() {
    return {
      title: '反赊账记录器',
    }
  },
  onShareTimeline() {
    return {
      title: '反赊账记录器',
    }
  },
  // 刷新页面
  refPageData(year: string) {
    const yearList = dataU.getYearDataKeys(true)
    let minDate = parseInt(year)
    yearList.forEach((v: string) => {
      let vv = parseInt(v)
      if (vv < minDate) {
        minDate = vv
      }
    });
    let list = dataU.year2List(year, true)
    dataU.coverYearIsShowSub(list, this.data.list)
    this.setData({
      date: year,
      startDate: `${minDate}`,
      endDate: dataU.getCurrentYear(),
      list: list
    })
  },
  copyTap() {
    let copyStr = dataU.yearList2CopyStr(this.data.list)
    if (copyStr.length > 0) {
      wx.setClipboardData({
        data: copyStr,
        success() {
          wx.showToast({ title: '本年数据已复制', icon: 'success' })
        },
        fail() {
          wx.showToast({ title: '复制失败！', icon: 'error', duration: 2000 })
        }
      })
    } else {
      wx.showToast({ title: '暂无数据', icon: 'error', duration: 2000 })
    }
  },
  importTap() {
    let self = this
    wx.getClipboardData({
      success(res) {
        self.importStrData(res.data)
      },
      fail() {
        wx.showToast({ title: '剪贴板复制失败', icon: 'error', duration: 2000 })
      }
    })
  },
  importStrData(v: string) {
    //       v = `
    // -$budget- | 3000 | 2023-12
    // ABC123 | -1000.10 | 2023-12-12 12:01:01
    // -$budget- | 3000 | 2024-02
    // -$budget- | 3000 | 2024-03
    // ABC | -1000.11 | 2024-03-01 12:01:01
    // ABCd | +100 | 2024-03-01 12:01:02
    //       `
    let list = dataU.importYearListStr(v)
    if (list.length < 1) {
      wx.showToast({ title: '剪贴板数据不对', icon: 'error', duration: 2000 })
      return
    }
    this.setData({
      ["importM.list"]: list,
      ["importM.show"]: true
    })
  },
  importModalConfirm() {
    let list = this.data.importM.list
    let importTip = dataU.importListData(list)
    if (!importTip) {
      let list = dataU.year2List(this.data.date, true)
      dataU.coverYearIsShowSub(list, this.data.list)
      this.setData({
        list: list,
        ["importM.show"]: false
      })
      wx.showToast({ title: '导入成功', icon: 'success' })
    } else {
      wx.showToast({ title: importTip, icon: 'error', duration: 2000 })
    }
  },
  bindDateChange(e: any) {
    let date = e.detail.value
    this.setData({
      date: date,
      list: dataU.year2List(date, true)
    })
    dataU.setDefYear(date)
  },
  cellTitleTap(e: any) {
    let i = e.currentTarget.dataset.i
    let vv = this.data.list[i] as any
    vv.isShowSub = !vv.isShowSub
    this.setData({ list: this.data.list })
  }
})
