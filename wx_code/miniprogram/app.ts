import dataU from './utils/data.js'


App<IAppOption>({
  globalData: {
  },
  onLaunch() {
    dataU.initData()
  }
})