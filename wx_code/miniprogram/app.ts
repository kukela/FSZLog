import conf from './utils/conf.js';
import dataU from './utils/data.js'
import syncD from './utils/syncData.js'

App<IAppOption>({
  globalData: {
  },
  onLaunch() {
    if(conf.env != 0) {
      require('./utils/test.js').initTestData()
      wx.showToast({
        title: '测试环境', icon: 'error', duration: 3000
      })
    }
    dataU.initData()
    syncD.init()
  }
})