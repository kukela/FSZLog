import dataU from './utils/data.js'
import syncD from './utils/syncData.js'

App<IAppOption>({
  globalData: {
  },
  onLaunch() {
    dataU.initData()
    syncD.init()
  }
})