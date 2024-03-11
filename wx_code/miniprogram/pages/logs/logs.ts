import conf from '../../utils/conf.js'
import data from '../../utils/data.js'
import dateU from '../../utils/date.js';
import IOData from '../../utils/IOData.js'

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
    this.refPageData(conf.getDefYear())
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
    const yearList = data.getYearDataKeys(true)
    let minDate = parseInt(year)
    yearList.forEach((v: string) => {
      let vv = parseInt(v)
      if (vv < minDate) {
        minDate = vv
      }
    });
    let list = data.year2List(year, true)
    data.coverYearIsShowSub(list, this.data.list)
    this.setData({
      date: year,
      startDate: `${minDate}`,
      endDate: dateU.getCurrentYear(),
      list: list
    })
  },
  // 拷贝数据
  copyTap() {
    let copyStr = IOData.yearList2CopyStr(this.data.list)
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
    //     v = `
    // -$budget- | 3000 | 2023-12
    // ABC123 | -1000.10 | 2023-12-12 12:01:01
    // -$budget- | 3000 | 2024-02
    // -$budget- | 3000 | 2024-03
    // ABC | -1000.11 | 2024-03-01 12:01:01
    // ABCd | +100 | 2024-03-01 12:01:02
    //     `
    let list = IOData.importYearListStr(v)
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
    let importTip = IOData.importListData(list)
    if (!importTip) {
      let list = data.year2List(this.data.date, true)
      data.coverYearIsShowSub(list, this.data.list)
      this.setData({
        list: list,
        ["importM.show"]: false
      })
      wx.showToast({ title: '导入成功', icon: 'success' })
    } else {
      wx.showToast({ title: importTip, icon: 'error', duration: 2000 })
    }
  },
  // 年点击事件
  bindDateChange(e: any) {
    let date = e.detail.value
    this.setData({
      date: date,
      list: data.year2List(date, true)
    })
    conf.setDefYear(date)
  },
  // 列表展开
  cellTitleTap(e: any) {
    let i = e.currentTarget.dataset.i
    let vv = this.data.list[i] as any
    if (vv.isShowSubAnim != undefined && vv.isShowSub != vv.isShowSubAnim) return
    let isShowSub = !vv.isShowSub
    this.setData({ [`list[${i}].isShowSubAnim`]: isShowSub })
    setTimeout(() => {
      this.setData({ [`list[${i}].isShowSub`]: isShowSub })
    }, isShowSub ? 0 : 230);
  }
})
