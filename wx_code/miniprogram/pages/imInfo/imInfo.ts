import IMData from '../../utils/IMData.js'
import dateU from '../../utils/date.js'

Page({
  data: {
  },
  onLoad(option) {
    // const m = IMData.id2ImData(option.id)
    const m = IMData.id2ImData("2")
    console.log(m)

    // wx.setNavigationBarTitle({
    //   title: dateU.getCurrentDateKey()
    // })
  },
  onShow() {
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
  }
})