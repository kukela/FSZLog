import COS from './cos/cos-wx-sdk-v5.min.js'
import base64 from '../../utils/base64.js'
import MD5 from '../../utils/md5.js'
import conf from '../../utils/conf.js'
import verifyU from '../../utils/verify.js';

Page({
  data: {
    isSync: false,
    userID: "",
    userID_verify: false,
    userID_tips: [{
      t: "请输入字母和数字组成的32位账号ID",
      f: verifyU.isEmptyFun
    }],
    dataPW: "",
    dataPW_verify: false,
    dataPW_tips: [{
      t: "请输入字母和数字组成的7~32位密码",
      f: verifyU.isEmptyFun
    }],
    syncType: "5",
    syncTypeList: [
      { t: "5分钟", v: "5" },
      { t: "30分钟", v: "30" }
    ],
  },
  onLoad() {
    this.setData({
      userID: conf.getUserID(),
      dataPW: conf.getDataPW(),
      'userID_tips[0].f': this.vUserID,
      'dataPW_tips[0].f': this.vDataPW,
    })

    // const cos = new COS({
    //   SecretId: 'AKIDJXjpxCXlUDrtoxDat5CC5nO4r0HzeEnJ',
    //   SecretKey: 'Vet0fRDvWwWBxpwwnS1QfyNavvHrOnDj',
    //   SimpleUploadMethod: 'putObject',
    // });
    // Global kukela
    // cos.getObject({
    //   Bucket: 'fsz-log-1256625630',
    //   Region: 'ap-nanjing',
    //   Key: 'Global/test1/t.txt',
    // }, function (err, data) {
    //   console.log(err || data.Body);
    // });

    // const customerKey = '0123456789ABCDEF0123456789ABCDEF'
    // const key = base64.base64Encode(customerKey)
    // const md5 = `${MD5.b64MD5(customerKey)}==`
    // cos.putObject({
    //   Bucket: 'fsz-log-1256625630',
    //   Region: 'ap-nanjing',
    //   Key: 'Global/test2/t1.txt',
    //   Body: 'hello!5',
    //   SSECustomerAlgorithm: 'AES256',
    //   SSECustomerKey: key,
    //   SSECustomerKeyMD5: md5,
    // }, function (err, data) {
    //   console.log(err || data);
    // });
  },
  onShow() {
    this.switchSync()
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
    conf.setIsSync(v)
    this.switchSync()
    if (v) {
      conf.setUserID(this.data.userID)
      conf.setDataPW(this.data.dataPW)
    }
  },
  // 启用同步切换
  switchSync() {
    const isSync = conf.getIsSync()
    this.setData({
      isSync: isSync,
      userID_verify: true,
      dataPW_verify: true
    })
    if (!isSync) {
      this.stopSync()
      return
    }
    if (!this.verifySync()) return
    this.startSync()
  },
  // 验证是否能启用同步
  verifySync(): boolean {
    const d = this.data
    if (verifyU.vTips(d.userID_tips, d.userID) ||
      verifyU.vTips(d.dataPW_tips, d.dataPW)) {
      this.setData({ isSync: false })
      return false
    }
    this.setData({
      isSync: true,
    })
    return true
  },
  // 启动同步
  startSync() {
    console.log("startSync")
  },
  // 停止同步
  stopSync() {
    console.log("stopSync")
  },
  // 清空原账号所有数据
  clearOldUserData() {
    console.log("clearOldUserData")
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
  // fszlog_uinfo:rnexzihk41g5oij1t1vyu1cklv0gbp36w0veglv3bbym6hszjmbtg1cqz7ym5868
    if(s.slice(0, 12) != "fszlog_uinfo") return

    console.log(s.slice(13))
  },
  // 拷贝账号信息到剪贴板
  copyUserInfo() {
    const d = this.data
    const s = `fszlog_uinfo:${d.userID}${d.dataPW}`
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
    this.setData({
      userID: this.genUUID()
    })
  },
  vUserID(v: string): boolean {
    if (verifyU.isEmptyFun(v) || v.length != 32) return true
    return !/^[0-9a-zA-Z]*$/.test(v)
  },
  // 密码
  genDataPW() {
    let pw = ""
    for (let i = 0; i < 32; i++) {
      let r = (Math.random() * 36) % 36 | 0;
      pw += r.toString(36)
    }
    // console.log(pw, pw.length)
    this.setData({ dataPW: pw })
  },
  vDataPW(v: string): boolean {
    if (verifyU.isEmptyFun(v) || v.length < 7 || v.length > 32) return true
    return !/^[0-9a-zA-Z]*$/.test(v)
  },
  // 生成唯一id
  genUUID: function () {
    let d = new Date().getTime();
    let uuid = d.toString(36)
    const l = 32 - uuid.length
    for (let i = 0; i < l; i++) {
      let r = (d + Math.random() * 36) % 36 | 0;
      uuid = r.toString(36) + uuid
      d = Math.floor(d / 16);
    }
    return uuid;
  },
})