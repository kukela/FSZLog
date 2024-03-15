import data from '../../utils/data.js';
import dateU from '../../utils/date.js';
import IOData from '../../utils/IOData.js';
import verifyU from '../../utils/verify.js';
import util from '../../utils/util.js';
import tags from '../../utils/tags.js';
import evalMath from '../../utils/eval_math.js';
import conf from '../../utils/conf.js';

Page({
  data: {
    pioTips: [{
      t: "请输入正确的价格",
      f: verifyU.vFloatFun
    }],
    evalMathFun: evalMath.evalMath,

    m: <any>{},
    budgetM: {
      show: false,
      verifyTips: false,
      budgetTips: [{
        t: "请输入正确的预算",
        f: verifyU.vFloatFun
      }]
    },
    budgetM_budget: "",

    editTagListM: {
      show: false,
      verifyTips: false,
      i: 0,
      p: "",
      pio: ""
    },
    editTagListM_v: "",

    tagList: <any>[],
    addM: {
      show: false,
      verifyTips: false,
      p: "",
      pio: "out",
      title_tips: [{
        t: "请输入标题",
        f: verifyU.vNullFun
      }]
    },
    addM_title: "",
    addM_piov: "",
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: dateU.getCurrentDateKey()
    })
  },
  onShow() {
    let m = data.date2DataObj(dateU.getCurrentDateKey(), 2)
    if (!m) m = data.newMonthData()
    this.monthDataChange(m, true)
    this.setData({
      m: m
    })
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
  // 预算点击事件
  budgetTap() {
    this.setData({
      ["budgetM.show"]: true,
      ["budgetM.verifyTips"]: false,
      budgetM_budget: this.data.m.budget
    })
  },
  // 预算弹窗确定事件
  budgetModalConfirm() {
    this.setData({ ["budgetM.verifyTips"]: true })
    let d = this.data
    let t_budget = d.budgetM_budget
    if (verifyU.vTips(d.budgetM.budgetTips, t_budget)) {
      return
    }
    let m = d.m
    m.budget = parseFloat(t_budget)
    this.setData({
      m: this.monthDataChange(m, true),
      ["budgetM.show"]: false
    })
    this.saveData()
  },
  // 列表展开
  cellMainTap: function (e: any) {
    let k = e.currentTarget.dataset.i
    let tag = this.data.m.tags[k]
    if (tag.isShowSubAnim != undefined && tag.isShowSub != tag.isShowSubAnim) return
    let isShowSub = !tag.isShowSub
    this.setData({ [`m.tags.[${k}].isShowSubAnim`]: isShowSub })
    setTimeout(() => {
      this.setData({ [`m.tags.[${k}].isShowSub`]: isShowSub })
    }, isShowSub ? 0 : conf.anim_list_d);
  },
  // 子列表事件
  cellSubTap: function (e: any) {
    let i = e.currentTarget.dataset.i
    let d = this.data
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
    let pM = util.pioStr2Obj(tag.p)
    let etlM = this.data.editTagListM
    etlM.show = true
    etlM.verifyTips = false
    etlM.i = i
    etlM.p = pM.p
    etlM.pio = pM.pio
    this.setData({ editTagListM: etlM })
  },
  // 编辑数据弹窗确定
  cellSubModalConfirm() {
    this.setData({ ["editTagListM.verifyTips"]: true })
    let d = this.data
    let pM = util.pioStr2Obj(d.editTagListM_v)
    if (verifyU.vTips(d.pioTips, pM.p)) {
      return
    }
    let etlM = this.data.editTagListM
    try {
      let eM = d.m.list[etlM.i]
      eM.p = d.editTagListM_v
      this.setData({
        m: this.monthDataChange(d.m, true),
        ["editTagListM.show"]: false
      })
      this.saveData()
    } catch (e) {
    }
  },
  // 删除一条数据弹窗
  cellSubDel() {
    let self = this
    let d = this.data
    wx.showModal({
      title: '提示',
      content: '删除后不可撤销，是否删除？',
      success(res) {
        if (!res.confirm) return
        try {
          let index = d.editTagListM.i
          d.m.list.splice(index, 1)
          self.setData({
            m: self.monthDataChange(d.m, true),
            ["editTagListM.show"]: false
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
    this.setData({
      ["addM.show"]: true,
      ["addM.verifyTips"]: false,
      ["addM.p"]: "",
      ["addM.pio"]: "out",
      tagList: tags.getAll(),
      addM_title: "",
      addM_piov: "",
    })
  },
  tagTap: function (e: any) {
    let i = e.currentTarget.dataset.i
    let tag = this.data.tagList[i]
    this.setData({ 'addM_title': tag.tt })
  },
  // 添加弹窗确定事件
  addModalConfirm() {
    this.setData({ ["addM.verifyTips"]: true })
    let d = this.data
    let pM = util.pioStr2Obj(d.addM_piov)
    let aTitle = IOData.strDes(d.addM_title)
    if (verifyU.vTips(d.addM.title_tips, aTitle) ||
      verifyU.vTips(d.pioTips, pM.p)) {
      return
    }
    let tag = {
      tt: aTitle,
      p: d.addM_piov,
      t: dateU.getCurrentDate().replace(`${d.m.date}-`, '')
    }
    d.m.list.unshift(tag)
    this.setData({
      m: this.monthDataChange(d.m, true),
      ["addM.show"]: false
    })
    this.saveData()
  },
  // 保存数据
  saveData() {
    console.log(this.data.m)
    // let tt = data.saveMonthData(this.data.m)
    // if (!tt) return
    // wx.showToast({
    //   title: tt, icon: 'error', duration: 2000
    // })
  },
  monthDataChange(m: any, isCalc: boolean): any {
    if (isCalc) data.monthCalc(m, 2)
    data.genMonthTags(m)
    data.coverMonthIsShowSub(m, this.data.m)
    return m
  },
})
