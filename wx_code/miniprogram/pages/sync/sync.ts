import COS from './cos/cos-wx-sdk-v5.min.js'
import base64 from '../../utils/base64.js'
import MD5 from '../../utils/md5.js'
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
    const uuid = this.generateUuid()
    console.log(uuid, uuid.length)
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
  // 启用同步
  syncSwitch(e: any) {
    const v = e.detail.value
    console.log(v)
    this.setData({
      userID_verify: true,
      dataPW_verify: true
    })
  },
  // 账号
  copyUserInfo() {
  },
  genUserID() {
    this.setData({
      userID: this.generateUuid()
    })
  },
  vUserID(v: string): boolean {
    if (verifyU.isEmptyFun(v) || v.length != 32) return true
    return !/^[0-9a-zA-Z]*$/.test(v)
  },
  // 密码
  genDataPW() {

  },
  vDataPW(v: string): boolean {
    if (verifyU.isEmptyFun(v)) return true
    return false
  },
  // 立即同步
  imSync() {

  },
  // 生成唯一id
  generateUuid: function () {
    let d = new Date().getTime();
    let uuid = ""
    for (let i = 0; i < 32; i++) {
      let r = (d + Math.random() * 36) % 36 | 0;
      uuid += r.toString(36)
      d = Math.floor(d / 16);
    }
    return uuid;
  }
})