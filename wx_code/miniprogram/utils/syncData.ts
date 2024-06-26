import verifyU from './verify.js';
import conf from './conf.js'
import S from './storage.js';
import COS from './cos/cos-wx-sdk-v5.min.js'
import base64 from './base64.js'
import MD5 from './md5.js'
import md5 from './md5.js';
import tags from './tags.js';
import dataU from './data.js'
import IMData from './IMData.js'

let cos: any = null;

export default {
  isSync: false,
  startSyncCount: 0,
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
  err: "",
  errCB: function () {
  },
  updatePage: function (kList: Array<string>) {
  },

  // 初始化
  init() {
    S.initLastUpdate()
    // conf.setUserID("rnexzihk41g5oij1t1vyu1cklv0gbp36")
    // conf.setDataPW("d4d0ov9jcoeymgbm9p5ff5ek55xcec")
    // conf.setUserID("u9epehwzkgfud4nmsle9ce1rlv3vk1as")
    // conf.setDataPW("bwcrze5rs96a47hif2q8imxhndr0qfyf")
    this.isSync = conf.getIsSync()
    this.startSyncCount = 0
    this.userID = conf.getUserID()
    this.dataPW = conf.getDataPW()
    this.userID_tips[0].f = this.vUserID
    this.dataPW_tips[0].f = this.vDataPW
    this.cosLastUpdate = {}
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
    return `fszlog_uinfo_${this.userID}${this.dataPW}`
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
    wx.clearStorageSync()
    dataU.init()
  },
  // 开始同步
  startSync() {
    if (this.startSyncCount < 0) this.startSyncCount = 0
    if (!this.isSync || this.startSyncCount++ > 0) return
    if (!cos) {
      cos = new COS({
        SecretId: 'AKIDJXjpxCXlUDrtoxDat5CC5nO4r0HzeEnJ',
        SecretKey: 'Vet0fRDvWwWBxpwwnS1QfyNavvHrOnDj',
        SimpleUploadMethod: 'putObject',
      });
      // this.getCOSData("2024-04", (isOk: boolean, v: string) => {
      //   console.log(v)
      // })
    }
    // console.log("startSync")
    this.getCOSData('lastUpdate', (isOk: boolean, v: string) => {
      this.startSyncCount--
      if (!isOk) return

      this.sync(this.checkLastUpdate(v), (upKeyList: Array<string>, getKeyList: Array<string>) => {
        wx.hideLoading({ noConflict: true })

        if (upKeyList.length > 0) {
          this.updateCOSLastUpdate(upKeyList)
        } else {
          this.startSyncCount--
        }
        if (getKeyList.length > 0) this.updatePageWithList(getKeyList)

      })
    })
  },
  // 检查需要同步的数据
  checkLastUpdate(luJsonStr: string): any {
    this.cosLastUpdate = S.parseLastUpdate(luJsonStr)
    let keys = new Set([...Object.keys(S.lastUpdate), ...Object.keys(this.cosLastUpdate)])
    // console.log(S.lastUpdate, this.cosLastUpdate, keys)
    let syncMap = <any>{}
    keys.forEach(k => {
      let cvv = NaN
      let cv = NaN
      let v = S.lastUpdate[k]
      try {
        const cvL = this.cosLastUpdate[k].split(',')
        cvv = parseInt(cvL[1])
        cv = parseInt(cvL[0])
      } catch (error) {
      }
      if (isNaN(cv)) cv = -1
      if (isNaN(v)) v = -1
      const sv = v - cv
      if (sv == 0) return
      if (cv == -1 && v == 0) {
        S.lastUpdate[k] = 1
      }
      syncMap[k] = { t: sv > 0 ? -1 : cv, v: isNaN(cvv) ? 0 : cvv }
    })
    return syncMap
  },
  // 同步操作
  sync(map: any, comp: any) {
    console.log(map)
    let okKeyList = <any>[]
    let upKeyList = <any>[]
    let getKeyList = <any>[]
    let keys = Object.keys(map)
    let upCount = keys.length
    if (upCount <= 0) {
      comp && comp(upKeyList, getKeyList)
      return
    }
    wx.showLoading({ title: "同步中", mask: true })
    keys.forEach(k => {
      const t = map[k].t
      if (t == 0) {
        comp && comp(upKeyList, getKeyList)
      } else if (t < 0) {
        this.putCOSData(k, S.getSyncData(k), (isOk: boolean) => {
          if (isOk) {
            okKeyList.push(k)
            upKeyList.push(k)
          }
          if (--upCount <= 0) { comp && comp(upKeyList, getKeyList) }
        })
      } else {
        // const v = map[k].v // 更新数据版本
        this.getCOSData(k, (isOk: boolean, v: string) => {
          if (isOk && S.setSyncData(k, v, t)) {
            okKeyList.push(k)
            getKeyList.push(k)
          }
          if (--upCount <= 0) { comp && comp(upKeyList, getKeyList) }
        })
      }
    });
  },
  // 更新cosLastUpdate
  updateCOSLastUpdate(upKeyList: Array<string>) {
    upKeyList.forEach(k => {
      this.cosLastUpdate[k] = `${S.lastUpdate[k]},${conf.currentDataVer}`
    });
    if (this.cosLastUpdate.installmentC) delete this.cosLastUpdate.installmentC
    this.putCOSData('lastUpdate', JSON.stringify(this.cosLastUpdate), (_: boolean) => {
      this.startSyncCount--
    })
  },
  // 根据key数组更新页面数据
  updatePageWithList(getKeyList: Array<string>) {
    let upDateList = []
    if (getKeyList.length > 0) {
      if (getKeyList.includes("tags")) {
        tags.init()
        upDateList.push("tags")
      }
      if (getKeyList.includes("installment")) {
        IMData.init()
        upDateList.push("IM")
      }
      for (const key in getKeyList) {
        if (key.indexOf(S.monthDataHKey) == 0) {
          upDateList.push("md")
          break
        }
      }
    }
    this.updatePage && this.updatePage(upDateList)
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
  getCOSData(key: string, complete: any) {
    cos.getObject({
      Key: this._getCOSPath(key),
      ...this._getCOS_OBJ_SSE()
    }, (err: any, data: any) => {
      if (err && err.statusCode != 404) {
        console.error(err)
        this.err = err.error
        wx.showToast({ title: `同步失败${err.statusCode}`, icon: 'error' })
        complete && complete(false, null)
        this.errCB && this.errCB()
        return
      }
      if (this.err) {
        this.err = ""
        this.errCB && this.errCB()
      }
      complete && complete(true, data ? data.Body : "")
    });
  },
  // 向cos传递数据
  putCOSData(key: string, v: string, complete: any) {
    cos.putObject({
      Key: this._getCOSPath(key),
      Body: v,
      ...this._getCOS_OBJ_SSE()
    }, (err: any, _: any) => {
      if (err) {
        console.error(err)
        this.err = err ? err.error : "未知错误"
        wx.showToast({ title: `同步失败${err.statusCode}`, icon: 'error' })
        complete && complete(false)
        this.errCB && this.errCB()
        return
      }
      if (this.err) {
        this.err = ""
        this.errCB && this.errCB()
      }
      complete && complete(true)
    });
  },
  // 获取COS路径
  _getCOSPath(key: string): string {
    let dn = encodeURI(md5.b64MD5(`${this.userID}${this.dataPW}`).replace(/\//g, 'b-'))
    let fn = encodeURI(md5.b64MD5(`${this.dataPW}${key}`).replace(/\//g, 'b-'))
    return `Global/${dn}/${fn}`
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