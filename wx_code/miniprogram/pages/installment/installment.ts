import IMData from '../../utils/IMData.js'
import dateU from '../../utils/date.js'
import verifyU from '../../utils/verify.js';
import anim from '../../utils/anim.js';

Page({
  data: {
    list: [
      { list: [], isData: false, isShowSub: true },
      { list: [], isData: false, isShowSub: false }
    ],
    addM: {
      show: false,
      verifyTips: false,
      title_tips: [{
        t: "请输入标题",
        f: verifyU.isEmptyFun
      }],
      pTips: [{
        t: "请输入正确的本金",
        f: verifyU.isNaNFloatFun
      }],
      imTypeTips: [{
        t: "请选择计息方式",
        f: verifyU.isEmptyFun
      }],
      irTips: [{
        t: "请输入正确的利率",
        f: verifyU.isNaNFloatFun
      }],
      qsTips: [{
        t: "分期不正确",
        f: verifyU.isNaNIntFun
      }],
      stTips: [{
        t: "请选择借款日期",
        f: verifyU.isNoDateStrFun
      }],
      stEnd: "",
      st_rTips: [{
        t: "请选择入账月份",
        f: verifyU.isNoDateStrFun
      }],
      st_rStart: "",
      st_rEnd: "",
    },
    addM_title: "",
    addM_p: "",
    addM_imType: "",
    addM_ir: "",
    addM_qs: "",
    addM_st: "",
    addM_st_r: "",
    imTypeList: [
      { t: "免息", v: "免息" }
    ],
  },
  onLoad() {
  },
  onShow() {
    this.setData({
      "list[0].list": IMData.list,
      "list[1].isData": IMData.isIMCList
    })
    // console.log(this.data.listC)
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
  // 拷贝数据点击事件
  copyTap() {
  },
  // 导入数据点击事件
  importTap() {
  },
  // 添加分期点击事件
  addTap() {
    let d = this.data
    let stEnd = new Date()
    stEnd.setMonth(stEnd.getMonth() + 2)
    stEnd.setDate(0)
    this.setData({
      ["addM.show"]: true,
      ["addM.verifyTips"]: false,
      addM_title: "",
      addM_p: "",
      addM_imType: d.imTypeList[0].v,
      addM_ir: "0",
      addM_qs: "",
      addM_st: "",
      ["addM.stEnd"]: dateU.getYearMonthDayKey(stEnd),
      addM_st_r: "",
      ["addM.st_rStart"]: "",
      ["addM.st_rEnd"]: "",
    })
  },
  // 添加分期 分期数输入框事件
  addModal_qsChange(_: any) {
    this.addModal_st_r_refData()
  },
  // 添加分期 借款日期改变事件
  addModal_stChange(v: any) {
    this.addModal_st_r_refData()
    if (this.data.addM_st_r) return
    const date = dateU.dateKey2Date(v.detail.v)
    date.setMonth(date.getMonth() + 1)
    this.setData({
      addM_st_r: dateU.getYearMonthKey(date)
    })
  },
  // 添加分期 入账月份限制条件
  addModal_st_r_refData() {
    const d = this.data
    if (!d.addM_st) return
    const sDate = dateU.dateKey2Date(d.addM_st)
    this.setData({ ["addM.st_rStart"]: dateU.getYearMonthDayKey(sDate) })
    let qs = parseInt(d.addM_qs)
    if (isNaN(qs)) return
    sDate.setMonth(sDate.getMonth() + qs)
    this.setData({ ["addM.st_rEnd"]: dateU.getYearMonthDayKey(sDate) })
  },
  // 计息方式帮助按钮点击事件
  imTypeHelpTap() {
    wx.showModal({
      title: '提示',
      content: '目前只有免息，未来会提供有息功能！'
    })
  },
  // 添加分期弹窗确定事件
  addModalConfirm() {
    this.setData({ ["addM.verifyTips"]: true })

  },
  // 分期标题点击事件
  cellMainTap(e: any) {
    const ds = e.currentTarget.dataset
    anim.cellSubShowHide(this, `list[${ds.mi}].list[${ds.i}]`)
  },
  // 分期编辑点击事件
  cellEditTap() {
  },
  // 分期更多事件点击事件
  cellMoreTap() {
  },
  // 显示数据点击事件
  onShowIMCListTap() {
    if (IMData.listC.length < 1) IMData.initCList()
    this.setData({
      "list[1].list": IMData.listC,
      "list[1].isData": IMData.isIMCList
    })
    anim.cellSubShowHide(this, `list[1]`, false)
  },
})