import conf from '../../utils/conf.js'
import data from '../../utils/data.js'
import dateU from '../../utils/date.js';
import IOData from '../../utils/IOData.js'
import IMData from '../../utils/IMData.js'

Page({
  data: {
    list: []
  },
  onLoad() {

  },
  onShow() {
    this.setData({
      list: IMData.list
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
})