import data from '../../utils/data.js';
import dateU from '../../utils/date.js';
import IOData from '../../utils/IOData.js';
import verifyU from '../../utils/verify.js';
import util from '../../utils/util.js';
import tags from '../../utils/tags.js';
import anim from '../../utils/anim.js';
import conf from '../../utils/conf.js';
import syncD from '../../utils/syncData.js'

Page({
  data: {
    pioTips: [{
      t: "请输入正确的价格",
      f: verifyU.isNaNFloatFun
    }],

    m: <any>{},
    budgetM: {
      show: false,
      verifyTips: false,
      budgetTips: [{
        t: "请输入正确的预算",
        f: verifyU.isNaNFloatFun
      }],
      v: "",
    },

    tagList: <any>[],
    addM: {
      show: false,
      isEdit: false,
      editI: 0,
      verifyTips: false,
      p: "",
      pio: "out",
      title_tips: [{
        t: "请输入标题",
        f: verifyU.isEmptyFun
      }]
    },
    addM_title: "",
    addM_piov: "",

    showKeyboard: false,
    mathKeyboardV: 0,
    mathKeyboardType: ""
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: dateU.getCurrentYearMonth()
    })
  },
  onShow() {
    this.updatePage()
    syncD.updatePage = (keyList: Array<string>) => {
      if (keyList.length <= 0) return
      this.updatePage()
    }
  },
  onHide() {
    syncD.updatePage = () => { }
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
  // 更新页面
  updatePage() {
    let m = data.checkCurrentMonthData()
    m.tags = this.data.m.tags
    data.genMonthTagsGroup(m)
    this.setData({
      m: m
    })
    if (this.data.addM.show) {
      this.setData({ tagList: tags.list })
    }
    // console.log(m)
  },
  // 预算点击事件
  budgetTap() {
    this.setData({
      ["budgetM.show"]: true,
      ["budgetM.verifyTips"]: false,
      ["budgetM.v"]: this.data.m.budget
    })
  },
  // 预算弹窗确定事件
  budgetModalConfirm() {
    this.setData({ ["budgetM.verifyTips"]: true })
    const d = this.data
    const t_budget = d.budgetM.v
    if (verifyU.vTips(d.budgetM.budgetTips, t_budget)) {
      return
    }
    const m = d.m
    m.budget = parseFloat(t_budget)
    this.setData({
      m: this.monthDataChange(m),
      ["budgetM.show"]: false
    })
    conf.setDefBudget(m.budget)
    this.saveData()
  },
  // 列表展开
  cellMainTap: function (e: any) {
    const i = e.currentTarget.dataset.i
    anim.cellSubShowHide(this, `m.tags[${i}]`)
  },
  // 子列表事件
  cellSubTap: function (e: any) {
    const i = e.currentTarget.dataset.i
    const d = this.data
    let tag = undefined
    try {
      tag = d.m.list[i]
    } catch (error) {
    }
    if (tag == null) {
      wx.showToast({
        title: '数据错误！', icon: 'error', duration: 2000
      })
      return
    }
    if (tag.isNS) {
      wx.showModal({
        title: '提示', content: '分期数据只能在分期页面修改！', showCancel: false
      })
      return
    }
    const pM = util.pio2Obj(tag.p)
    this.setData({
      ["addM.show"]: true,
      ["addM.isEdit"]: true,
      ["addM.verifyTips"]: false,
      ["addM.editI"]: i,
      ["addM.p"]: pM.p,
      ["addM.pio"]: pM.pio
    })
  },
  // 编辑数据弹窗确定
  cellSubModalConfirm() {
    this.setData({ ["addM.verifyTips"]: true })
    const d = this.data
    const pM = util.pio2Obj(d.addM_piov)
    if (verifyU.vTips(d.pioTips, pM.p)) {
      return
    }
    const etlM = this.data.addM
    try {
      const eM = d.m.list[etlM.editI]
      eM.p = parseFloat(d.addM_piov)
      this.setData({
        m: this.monthDataChange(d.m),
        ["addM.show"]: false
      })
      this.saveData()
    } catch (e) {
    }
  },
  // 删除一条数据弹窗
  cellSubDel() {
    const self = this
    const d = this.data
    wx.showModal({
      title: '提示',
      content: '删除后不可撤销，是否删除？',
      success(res) {
        if (!res.confirm) return
        try {
          const index = d.addM.editI
          d.m.list.splice(index, 1)
          self.setData({
            m: self.monthDataChange(d.m),
            ["addM.show"]: false
          })
          self.saveData()
        } catch (error) {
          console.error(error)
          wx.showToast({ title: '删除失败！', icon: 'error', duration: 2000 })
        }
      }
    })
  },
  // 添加事件
  showAddModalTap: function () {
    if (this.data.tagList.length <= 0) tags.init()
    this.setData({
      ["addM.show"]: true,
      ["addM.isEdit"]: false,
      ["addM.verifyTips"]: false,
      ["addM.p"]: "",
      ["addM.pio"]: "out",
      tagList: tags.list,
      addM_title: "",
      addM_piov: "",
    })
  },
  tagTap: function (e: any) {
    const i = e.currentTarget.dataset.i
    const tag = this.data.tagList[i]
    this.setData({ 'addM_title': tag.tt })
  },
  tagLongTap: function (e: any) {
    const i = e.currentTarget.dataset.i
    let self = this
    wx.showModal({
      title: '删除标签',
      content: '删除后不可撤销，是否删除？',
      success(res) {
        if (!res.confirm) return
        tags.delTagWithIndex(i)
        tags.saveTags()
        self.setData({
          tagList: tags.list
        })
      }
    })
  },
  addModalPiovChange: function (e: any) {
    this.setData({ addM_piov: e.detail.value })
  },
  // 添加弹窗确定事件
  addModalConfirm() {
    const d = this.data
    if (d.addM.isEdit) {
      this.cellSubModalConfirm()
      return
    }
    this.setData({ ["addM.verifyTips"]: true })
    const aTitle = IOData.strDes(d.addM_title)
    if (verifyU.vTips(d.addM.title_tips, aTitle) ||
      verifyU.vTips(d.pioTips, d.addM_piov)) {
      return
    }
    const td = {
      tt: aTitle,
      p: parseFloat(d.addM_piov),
      t: dateU.getCurrentDate().replace(`${d.m.date}-`, '')
    }
    d.m.list.unshift(td)
    this.setData({
      m: this.monthDataChange(d.m),
      tagList: tags.addTagTitle(aTitle),
      ["addM.show"]: false
    })
    this.saveData()
    tags.saveTags()
  },
  // 打开计算器键盘
  openMathKeyboard(e: any) {
    const type = e.currentTarget.dataset.t
    let mathKeyboardV = 0
    switch (type) {
      case "b":
        mathKeyboardV = parseFloat(this.data.budgetM.v)
        break
      case "add":
        mathKeyboardV = parseFloat(this.data.addM.p)
        break;
      case "edit":
        mathKeyboardV = parseFloat(this.data.addM.p)
        break;
      default:
        break;
    }
    if (isNaN(mathKeyboardV)) mathKeyboardV = 0
    this.setData({
      showKeyboard: true, mathKeyboardType: type, mathKeyboardV: mathKeyboardV
    })
  },
  // 计算器键盘确定事件
  mathKeyboardOk(e: any) {
    const v = e.detail.v
    switch (this.data.mathKeyboardType) {
      case "b":
        this.setData({ ["budgetM.v"]: `${v}` })
        break
      case "add":
        this.setData({ ["addM.p"]: `${v}` })
        break;
      case "edit":
        this.setData({ ["addM.p"]: `${v}` })
        break;
      default:
        break;
    }
  },
  // 保存数据
  saveData(m: any = null) {
    const sm = m ? m : this.data.m
    const tt = IOData.saveMonthData(sm)
    if (!tt) return
    wx.showToast({
      title: tt, icon: 'error', duration: 2000
    })
  },
  monthDataChange(m: any): any {
    return data.monthCalc(m, 2, true)
  },
})
