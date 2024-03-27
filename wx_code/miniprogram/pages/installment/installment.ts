import IMData from '../../utils/IMData.js'
import dateU from '../../utils/date.js'
import IOData from '../../utils/IOData.js'
import verifyU from '../../utils/verify.js';
import anim from '../../utils/anim.js';
import util from '../../utils/util.js';

Page({
  data: {
    list: [
      { list: [], isData: false, isSS: true },
      { list: [], isData: false, isSS: false }
    ],
    addM: {
      show: false,
      editIL: [],
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
      }, {
        t: "入账月份应在分期期限内",
        f: function (_: string) {
          return false
        }
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
      { t: "免息", v: "免息" },
      { t: "等额本金", v: "等额本金" },
      { t: "等额本息", v: "等额本息" }
    ],
    importM: {
      show: false,
      list: <any>[],
    }
  },
  onLoad() {
    this.initAddModalData()
    this.setData({
      "list[0].list": IMData.list,
      "list[1].isData": IMData.isIMCList(),
      ["addM.st_rTips[1].f"]: this.verify_addM_st_r
    })
  },
  onShow() {
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
    const copyStr = IOData.imData2CopyStr(IMData.list, IMData.listC)
    if (copyStr.length > 0) {
      wx.setClipboardData({
        data: copyStr,
        success() {
          wx.showToast({ title: '分期数据已复制', icon: 'success' })
        },
        fail() {
          wx.showToast({ title: '复制失败！', icon: 'error', duration: 2000 })
        }
      })
    } else {
      wx.showToast({ title: '暂无数据', icon: 'error', duration: 2000 })
    }
  },
  // 导入数据点击事件
  importTap() {
    const self = this
    wx.getClipboardData({
      success(res) {
        self.importStrData(res.data)
      },
      fail() {
        wx.showToast({ title: '剪贴板复制失败', icon: 'error', duration: 2000 })
      }
    })
  },
  importStrData(v: string) {
    const list = IOData.importIMDataStr(v)
    if (list.length < 1) {
      wx.showToast({ title: '剪贴板数据不对', icon: 'error', duration: 2000 })
      return
    }
    this.setData({
      ["importM.list"]: list,
      ["importM.show"]: true
    })
  },
  importModalConfirm() {
    const importTip = IOData.importIMListData(this.data.importM.list)
    if (!importTip) {
      this.setData({
        "list[0].list": IMData.list,
        "list[1].isData": IMData.isIMCList(),
      })
      wx.showToast({ title: '导入成功', icon: 'success' })
    } else {
      wx.showToast({ title: importTip, icon: 'error', duration: 2000 })
    }
    this.setData({
      ["importM.list"]: [],
      ["importM.show"]: false
    })
  },
  // 添加分期点击事件
  addTap() {
    if (this.data.addM.editIL.length) this.initAddModalData()
    this.setData({
      ["addM.show"]: true,
      ["addM.editIL"]: [],
      ["addM.verifyTips"]: false,
    })
  },
  // 初始化添加弹窗数据
  initAddModalData() {
    let d = this.data
    let stEnd = new Date()
    dateU.setMonthV(stEnd, stEnd.getMonth() + 1)
    this.setData({
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
      ["addM.verifyTips"]: false,
    })
  },
  // 计息方式改变事件
  addModal_imTypeChange(_: any) {
    const d = this.data
    if (d.addM_imType == "免息") {
      this.setData({ addM_ir: "0" })
    } else {
      if (d.addM_ir == "0") this.setData({ addM_ir: "" })
    }
  },
  // 计息方式帮助按钮点击事件
  imTypeHelpTap() {
    let showText = ""
    const t = this.data.addM_imType
    switch (t) {
      case "免息":
        showText = "每月还款金额一致。"
        break;
      case "等额本金":
        showText = "每月还款金额逐月递减，本金固定，利息逐月递减。"
        break;
      case "等额本息":
        showText = "每月还款金额一致，本金逐月递增，利息逐月递减。"
        break;
      default:
        showText = "未知分期类型！"
        break;
    }
    wx.showModal({ title: t, content: showText, showCancel: false })
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
    dateU.monthPlus(date)
    this.setData({
      addM_st_r: dateU.getYearMonthKey(date)
    })
  },
  // 添加分期 入账月份限制条件
  addModal_st_r_refData() {
    const d = this.data
    if (!d.addM_st) return
    const tDate = dateU.dateKey2Date(d.addM_st)
    dateU.monthPlus(tDate)
    this.setData({
      ["addM.st_rStart"]: dateU.getYearMonthDayKey(tDate)
    })
    const qs = parseInt(d.addM_qs)
    if (isNaN(qs)) return
    dateU.setMonthV(tDate, tDate.getMonth() + qs - 1)
    this.setData({ ["addM.st_rEnd"]: dateU.getYearMonthDayKey(tDate) })
  },
  // 验证入账月份
  verify_addM_st_r(v: string): boolean {
    const vv = dateU.date2YMNum(dateU.dateKey2Date(v))
    const addM = this.data.addM
    if (addM.st_rStart) {
      const stNum = dateU.date2YMNum(dateU.dateKey2Date(addM.st_rStart))
      if (vv < stNum) return true
    }
    if (addM.st_rEnd) {
      const etNum = dateU.date2YMNum(dateU.dateKey2Date(addM.st_rEnd))
      if (vv > etNum) return true
    }
    return false
  },
  // 添加分期弹窗确定事件
  addModalConfirm() {
    this.setData({ ["addM.verifyTips"]: true })
    const d = this.data
    const addMTitle = IOData.strDes(d.addM_title)
    const vTips = verifyU.vTips
    if (vTips(d.addM.title_tips, addMTitle) ||
      vTips(d.addM.pTips, d.addM_p) ||
      vTips(d.addM.imTypeTips, d.addM_imType) ||
      vTips(d.addM.irTips, d.addM_ir) ||
      vTips(d.addM.qsTips, d.addM_qs) ||
      vTips(d.addM.stTips, d.addM_st) ||
      vTips(d.addM.st_rTips, d.addM_st_r)) {
      return
    }
    let nm = <any>{}
    if (d.addM.editIL.length) {
      nm = util.key2Obj(this.data, this.iList2DataKey(d.addM.editIL))
    }
    nm.tt = addMTitle
    nm.p = parseFloat(d.addM_p)
    nm.type = { t: d.addM_imType, ir: parseFloat(d.addM_ir) }
    nm.qs = parseInt(d.addM_qs)
    nm.st = d.addM_st
    nm.st_r = d.addM_st_r
    const tList = []
    if (d.addM.editIL.length) {
      const editTL = IMData.editData(nm)
      // console.log(nm)
      if (editTL.length <= 0) {
        wx.showToast({ title: '编辑失败！', icon: 'error', duration: 2000 })
        return
      }
      if (editTL[0] == 3) {
        this.imArcData(nm, () => {
          IMData.delData(nm)
          this.addModalConfirmSucc(editTL)
        })
        return
      }
      tList.push(...editTL)
    } else {
      const addT = IMData.addData(nm)
      if (addT == 0) {
        wx.showToast({ title: '添加失败！', icon: 'error', duration: 2000 })
        return
      }
      if (addT == 3) {
        this.imArcData(nm, this.addModalConfirmSucc)
        return
      }
      tList.push(addT)
    }
    this.addModalConfirmSucc(tList)
  },
  addModalConfirmSucc(refList: Array<number>) {
    if (refList) {
      refList.forEach(k => {
        if (k != 2 && k != 1) return
        this.refListData(k == 2)
      });
    }
    this.setData({
      ["addM.show"]: false,
      ["addM.editIL"]: [],
    })
    this.initAddModalData()
  },
  // 将数据归档到历史列表
  imArcData(m: any, succ: any = null) {
    wx.showModal({
      title: '提示', content: '当前数据已完成超过90天，点击确定会归档到历史数据中！',
      success(res) {
        if (!res.confirm) return
        if (!IMData.arcData(m)) {
          wx.showToast({ title: '归档失败！', icon: 'error', duration: 2000 })
          return
        }
        succ && succ()
      }
    })
  },
  // 刷新数据
  refListData(isC: boolean) {
    if (!isC) {
      this.setData({ "list[0].list": IMData.list })
    } else {
      this.setData({
        "list[1].list": IMData.listC,
        "list[1].isData": IMData.isIMCList()
      })
      anim.cellSubShowHide(this, `list[1]`, false, 1)
    }
  },
  // 分期标题点击事件
  cellMainTap(e: any) {
    const iL = e.currentTarget.dataset.i
    anim.cellSubShowHide(this, this.iList2DataKey(iL))
  },
  // 分期编辑点击事件
  cellEditTap(e: any) {
    const iL = e.currentTarget.dataset.i
    const m = this.iList2Data(iL)
    // console.log(m)
    this.setData({
      ["addM.show"]: true,
      ["addM.editIL"]: iL,
      addM_title: m.tt,
      addM_p: m.p,
      addM_imType: m.type.t,
      addM_ir: m.type.ir,
      addM_qs: m.qs,
      addM_st: m.st,
      addM_st_r: m.st_r,
    })
    this.addModal_st_r_refData()
  },
  // 分期删除事件
  cellDelTap() {
    const self = this
    const m = this.iList2Data(this.data.addM.editIL)
    wx.showModal({
      title: '提示',
      content: '删除操作会删除所有关联数据，并且删除后不可撤销，是否删除？',
      success(res) {
        if (!res.confirm) return
        const delT = IMData.delData(m)
        if (delT == 0) {
          wx.showToast({ title: '删除失败！', icon: 'error', duration: 2000 })
          return
        }
        self.refListData(delT == 2)
        self.setData({
          ["addM.show"]: false,
          ["addM.editIL"]: [],
        })
        self.initAddModalData()
      }
    })
  },
  // 通过index数组获取分期数据
  iList2Data(iL: Array<number>): any {
    return util.key2Obj(this.data, this.iList2DataKey(iL))
  },
  iList2DataKey(iL: Array<number>): string {
    return `list[${iL[0]}].list[${iL[1]}]`
  },
  // 分期更多事件点击事件
  cellMoreTap(e: any) {
    const iL = e.currentTarget.dataset.i
    const m = this.iList2Data(iL)
    wx.navigateTo({
      url: `/pages/imInfo/imInfo?id=${m.id}`
    })
  },
  // 显示数据点击事件
  onShowIMCListTap() {
    this.setData({ "list[1].list": IMData.listC })
    const m = anim.cellSubShowHide(this, `list[1]`, false)
    if (m.isSS == false) {
      anim.setAllShowSub(IMData.listC, m.isSS)
    }
    this.setData({
      "list[1].list": IMData.listC,
      "list[1].isData": IMData.isIMCList()
    })
  },
})