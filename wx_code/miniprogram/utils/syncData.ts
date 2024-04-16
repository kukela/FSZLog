import verifyU from './verify.js';
import conf from './conf.js'
import COS from './cos/cos-wx-sdk-v5.min.js'
import base64 from './base64.js'
import MD5 from './md5.js'

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
  // 初始化
  init() {
    this.isSync = conf.getIsSync()
    this.userID = conf.getUserID()
    this.dataPW = conf.getDataPW()
    this.userID_tips[0].f = this.vUserID
    this.dataPW_tips[0].f = this.vDataPW
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
  // 验证数据是否需要同步
  startSync() {
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
}