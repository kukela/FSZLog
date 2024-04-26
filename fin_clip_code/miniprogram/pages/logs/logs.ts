import conf from '../../utils/conf.js'
import data from '../../utils/data.js'
import dateU from '../../utils/date.js';
import IOData from '../../utils/IOData.js'
import anim from '../../utils/anim.js';
import syncD from '../../utils/syncData.js'

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
  onShow() {
    this.refPageData(conf.getDefYear())
    syncD.updatePage = (keyList: Array<string>) => {
      if (keyList.length <= 0) return
      this.refPageData(conf.getDefYear())
    }
  },
  onHide() {
    syncD.updatePage = () => { }
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
    const endDate = dateU.getCurrentYear()
    let startDate = endDate
    let yearList = data.getAllYears()
    if (yearList.length > 0) {
      startDate = yearList[yearList.length - 1]
    }
    const list = data.year2List(year, 2)
    data.coverYearIsShowSub(list, this.data.list)
    if (year == endDate) {
      const nmData = data.getNextMonthData()
      nmData.isNMData = true
      list.unshift(nmData)
    }
    this.setData({
      date: year,
      startDate: startDate,
      endDate: endDate,
      list: list
    })
  },
  // 拷贝数据
  copyTap() {
    const copyStr = IOData.yearList2CopyStr(this.data.list)
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
  // 导入数据
  importTap() {
    const self = this
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
    /*
    v = `
-$budget- | 3003 | 2023-12
ABC123 | -1000.10 | 2023-12-12 12:01:01
-$budget- | 3002 | 2024-02
-$budget- | 3001 | 2024-03
ABC | -1000.11 | 2024-03-01 12:01:01
ABCd | +100 | 2024-03-01 12:01:02
    `
    */
    const list = IOData.importYearListStr(v)
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
    const importTip = IOData.importListData(this.data.importM.list)
    this.setData({
      ["importM.list"]: [],
      ["importM.show"]: false
    })
    if (importTip) {
      wx.showToast({ title: importTip, icon: 'error', duration: 2000 })
      return
    }
    const list = data.year2List(this.data.date, 2)
    data.coverYearIsShowSub(list, this.data.list)
    wx.showToast({ title: '导入成功', icon: 'success' })
    this.refPageData(conf.getDefYear())
  },
  // 年点击事件
  bindDateChange(e: any) {
    const date = e.detail.value
    this.refPageData(date)
    conf.setDefYear(date)
  },
  // 列表展开
  cellTitleTap(e: any) {
    const i = e.currentTarget.dataset.i
    anim.cellSubShowHide(this, `list[${i}]`)
  }
})
