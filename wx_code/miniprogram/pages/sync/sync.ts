import conf from '../../utils/conf.js'
import syncData from '../../utils/syncData.js'
import syncD from '../../utils/syncData.js'

Page({
  data: {
    isSync: false,
    userID: "",
    userID_verify: false,
    userID_tips: <any>[],
    dataPW: "",
    dataPW_verify: false,
    dataPW_tips: <any>[],
    syncType: "5",
    syncTypeList: [
      { t: "5分钟", v: "5" },
      { t: "30分钟", v: "30" }
    ],
  },
  onLoad() {
    this.setData({
      userID_tips: syncD.userID_tips,
      dataPW_tips: syncD.dataPW_tips,
    })
  },
  onShow() {
    if (!syncD.verifySync()) {
      this.closeSync()
    }
    this.setData({
      isSync: syncD.isSync,
      userID: syncD.userID,
      dataPW: syncD.dataPW,
    })
    syncD.startSync()
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
  // 启用同步切换按钮事件
  syncSwitchChange(e: any) {
    const v = e.detail.value
    const d = this.data
    if (!v || !syncD.verifySync(d.userID, d.dataPW)) {
      this.setData({
        userID_verify: true, dataPW_verify: true
      })
      this.closeSync()
      return
    }
    this.switchUserInfo(d.userID, d.dataPW, (_: number) => {
      this.openSync()
    })
  },
  // 打开同步
  openSync() {
    syncD.openSync()
    this.setData({ isSync: syncD.isSync })
    syncD.startSync()
  },
  // 关闭同步
  closeSync() {
    syncD.closeSync()
    this.setData({ isSync: syncD.isSync })
  },
  // 从剪贴板导入账号信息
  importUserInfoTap() {
    const self = this
    wx.getClipboardData({
      success(res) {
        self.importUserInfo(res.data)
      },
      fail() {
        wx.showToast({ title: '剪贴板复制失败', icon: 'error', duration: 2000 })
      }
    })
  },
  importUserInfo(s: string) {
    // fszlog_uinfo:rnexzihk41g5oij1t1vyu1cklv0gbp36d4d0ov9jcoeymgbm9p5ff5ek55xcec
    // fszlog_uinfo:u9epehwzkgfud4nmsle9ce1rlv3vk1asbwcrze5rs96a47hif2q8imxhndr0qfyf
    if (s.slice(0, 12) != "fszlog_uinfo") {
      wx.showToast({ title: '账号信息错误', icon: 'error', duration: 2000 })
      return
    }
    if (s.length < 13 + 32 + 7) {
      wx.showToast({ title: '账号信息不全', icon: 'error', duration: 2000 })
      return
    }
    const userID = s.slice(13, 13 + 32)
    const dataPW = s.slice(13 + 32)
    // console.log(userID, userID.length, dataPW, dataPW.length)
    if (!syncData.verifySync(userID, dataPW)) {
      wx.showToast({ title: '账号信息错误', icon: 'error', duration: 2000 })
      return
    }
    this.switchUserInfo(userID, dataPW, (v: number) => {
      if (v == 0) wx.showToast({ title: '账号相同', icon: 'none' })
      else if (v == 2) this.openSync()
    })
  },
  switchUserInfo(userID: string, dataPW: string, comp: any) {
    if (conf.getUserID() == userID && conf.getDataPW() == dataPW) {
      comp && comp(0)
      return
    }
    if (!conf.getUserID() || !conf.getDataPW()) {
      this.importUserInfo2(userID, dataPW)
      comp && comp(1)
      return
    }
    const self = this
    wx.showModal({
      title: '提示',
      content: '切换账号后，本地数据会全部删除。是否执行切换操作？',
      success(res) {
        if (res.cancel) {
          self.closeSync()
          self.importUserInfo2(conf.getUserID(), conf.getDataPW())
          return
        }
        if (res.confirm) {
          syncD.clearOldUserData()
          self.importUserInfo2(userID, dataPW)
          wx.showToast({ title: '账号切换成功', icon: 'success' })
          comp && comp(2)
        }
      }
    })
  },
  importUserInfo2(userID: string, dataPW: string) {
    syncD.importUser(userID, dataPW)
    this.setData({
      userID: userID,
      dataPW: dataPW,
      isSync: syncD.isSync
    })
  },
  // 拷贝账号信息到剪贴板
  copyUserInfo() {
    const s = syncD.exportUserInfo()
    if (s.length < 13 + 32 + 7) {
      wx.showToast({ title: '账号信息不全', icon: 'error', duration: 2000 })
      return
    }
    wx.setClipboardData({
      data: s,
      success() {
        wx.showToast({ title: '账号信息已复制', icon: 'success' })
      },
      fail() {
        wx.showToast({ title: '复制失败！', icon: 'error', duration: 2000 })
      }
    })
  },
  // 账号
  genUserID() {
    this.setData({ userID: syncD.genUUID() })
  },
  // 密码
  genDataPW() {
    this.setData({ dataPW: syncD.genDataPW() })
  },
})