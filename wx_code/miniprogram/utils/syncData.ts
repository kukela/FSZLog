import verifyU from './verify.js';
import conf from './conf.js'
import S from './storage.js';
import COS from './cos/cos-wx-sdk-v5.js'
import base64 from './base64.js'
import MD5 from './md5.js'
import md5 from './md5.js';

let cos: any = null;

export default {
  isSync: false,
  userID: "",
  userID_tips: [{
    t: "请输入字母和数字组成的32位账号ID",
    f: verifyU.isEmptyFun
  }],
  dataPW: "",
  dataPW_tips: [{
    t: "请输入字母和数字组成的7~32位密码",
    f: verifyU.isEmptyFun
  }],
  // 云端数据最后更新时间
  cosLastUpdate: <any>{
    // conf: "0,3",
  },

  // 初始化
  init() {
    S.initLastUpdate()
    this.isSync = conf.getIsSync()
    this.userID = conf.getUserID()
    this.dataPW = conf.getDataPW()
    this.userID_tips[0].f = this.vUserID
    this.dataPW_tips[0].f = this.vDataPW
    this.startSync()
  },
  // 导入账号信息
  importUser(userID: string, dataPW: string) {
    this.userID = userID
    this.dataPW = dataPW
    conf.setUserID(userID)
    conf.setDataPW(dataPW)
  },
  // 导出账号信息
  exportUserInfo(): string {
    return `fszlog_uinfo:${this.userID}${this.dataPW}`
  },
  // 打开同步
  openSync() {
    this.isSync = true
    conf.setIsSync(true)
  },
  // 关闭同步
  closeSync() {
    this.isSync = false
    conf.setIsSync(false)
  },
  // 清空原账号所有数据
  clearOldUserData() {
    this.closeSync()
    console.log("clearOldUserData")
  },
  // 开始同步
  startSync() {
    if (!conf.getIsSync()) return
    if (!cos) {
      cos = new COS({
        SecretId: 'AKIDJXjpxCXlUDrtoxDat5CC5nO4r0HzeEnJ',
        SecretKey: 'Vet0fRDvWwWBxpwwnS1QfyNavvHrOnDj',
        SimpleUploadMethod: 'putObject',
      });
    }
    this.getCOSData('lastUpdate', (v: string) => {
      // this.sync(this.checkLastUpdate(v))
    })
    // this.putCOSData('test', "test", () => { console.log("ok") })
  },
  // 检查需要同步的数据
  checkLastUpdate(luJsonStr: string): any {
    this.cosLastUpdate = S.parseLastUpdate(luJsonStr)
    let syncMap = <any>{}
    Object.keys(S.lastUpdate).forEach(k => {
      let cvv = 0
      let cv = 0
      try {
        const cvL = this.cosLastUpdate[k].split(',')
        cvv = parseInt(cvL[1])
        cv = parseInt(cvL[0])
      } catch (error) {
        syncMap[k] = 1
        return
      }
      const v = S.lastUpdate[k]
      if (isNaN(cvv) || isNaN(cv) || cvv < conf.getDataVer()) {
        syncMap[k] = 1
      } else {
        syncMap[k] = v - cv
      }
    })
    return syncMap
  },
  // 同步操作
  sync(map: any) {
    console.log(map)
    let okKeyList = []
    Object.keys(map).forEach(k => {
      const v = map[k]
      if (v == 0) return
      if (v > 0) {
        this.putCOSData(k, S.getSyncData(k), () => {
          okKeyList.push(k)
        })
      } else {
        this.getCOSData(k, (v: string) => {
          okKeyList.push(k)
        })
      }
    });
  },
  // 验证是否能启用同步
  verifySync(uid: string = "", dpw: string = ""): boolean {
    if (verifyU.vTips(this.userID_tips, uid ? uid : this.userID) ||
      verifyU.vTips(this.dataPW_tips, dpw ? dpw : this.dataPW)) {
      return false
    }
    return true
  },
  vUserID(v: string): boolean {
    if (verifyU.isEmptyFun(v) || v.length != 32) return true
    return !/^[0-9a-zA-Z]*$/.test(v)
  },
  vDataPW(v: string): boolean {
    if (verifyU.isEmptyFun(v) || v.length < 7 || v.length > 32) return true
    return !/^[0-9a-zA-Z]*$/.test(v)
  },
  // 生成密码
  genDataPW(): string {
    let pw = ""
    for (let i = 0; i < 32; i++) {
      let r = (Math.random() * 36) % 36 | 0;
      pw += r.toString(36)
    }
    return pw
  },
  // 生成唯一id
  genUUID(): string {
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
  // 从cos获取数据
  getCOSData(key: string, suss: any) {
    cos.getObject({
      Key: this._getCOSPath(key),
      ...this._getCOS_OBJ_SSE()
    }, function (err: any, data: any) {
      if (err && err.statusCode != 404) {
        console.error(err)
        wx.showToast({ title: `获取失败${err.statusCode}`, icon: 'error' })
        return
      }
      suss && suss(data ? data.Body : "")
    });
  },
  // 向cos传递数据
  putCOSData(key: string, v: string, suss: any) {
    cos.putObject({
      Key: this._getCOSPath(key),
      Body: v,
      ...this._getCOS_OBJ_SSE()
    }, function (err: any, data: any) {
      if (err || data.statusCode != 200) {
        console.error(err)
        wx.showToast({ title: `上传失败${err.statusCode}`, icon: 'error' })
        return
      }
      suss && suss()
    });
  },
  // 获取COS路径
  _getCOSPath(key: string): string {
    return `Global/${this.userID}/${md5.b64MD5(`${this.dataPW}${key}`)}`
  },
  // 获取COS数据密码
  _getCOSDataPW(): string {
    let pw = this.dataPW
    for (let i = pw.length; i < 32; i++) {
      pw += "0"
    }
    return pw
  },
  // 获取COS对象操作公用信息
  _getCOS_OBJ_SSE() {
    const pw = this._getCOSDataPW()
    const cKey = base64.base64Encode(pw)
    const cMD5 = `${MD5.b64MD5(pw)}==`
    return {
      Bucket: 'fsz-log-1256625630',
      Region: 'ap-nanjing',
      SSECustomerAlgorithm: 'AES256',
      SSECustomerKey: cKey,
      SSECustomerKeyMD5: cMD5,
    }
  }
}