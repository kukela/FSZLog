import IMData from '../../utils/IMData.js'
import dateU from '../../utils/date.js'

Page({
  data: {
    m: {},
    ctv: 0
  },
  onLoad(option) {
    const m = IMData.id2ImData(option.id)
    // const m = IMData.id2ImData("2")
    this.setData({
      m: m,
      ctv: dateU.date2YMNum(new Date())
    })
    wx.setNavigationBarTitle({
      title: m.tt
    })
    // console.log(m)
  },
  onShow() {
    // wx.pageScrollTo({
    //   selector: `#t${this.data.ctv}`,
    //   duration: 300
    // })
    wx.createSelectorQuery()
      .select('#scrollview')
      .node()
      .exec((res) => {
        const scrollView = res[0].node;
        scrollView.scrollIntoView(`#t${this.data.ctv}`)
      })
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
  cellTap(e: any) {
    const i = e.currentTarget.dataset.i
    console.log(i)
    wx.showModal({
      title: '提示', content: '提前还款功能正在开发中', showCancel: false
    })
  }
})