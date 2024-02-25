import dataU from './utils/data.js'

App<IAppOption>({
  globalData: {
  },
  onLaunch() {
    dataU.initData()
    
    require('./utils/test.js').initTestData()
  }
})