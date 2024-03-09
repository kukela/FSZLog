import dataU from '../../utils/data.js';
import util from '../../utils/util.js';
import verifyU from '../../utils/verify.js';

Component({
  data: {
    pioTips: [{
      t: "请输入正确的价格",
      f: verifyU.vFloatFun
    }],

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
  lifetimes: {
    attached: function () {
      wx.setNavigationBarTitle({
        title: util.getCurrentDateKey()
      })
    }
  },
  pageLifetimes: {
    show: function () {
      let m = dataU.date2DataObj(util.getCurrentDateKey())
      if (m == null) {
        m = dataU.newMonthData()
      }
      dataU.coverMonthIsShowSub(m, this.data.m)
      this.setData({
        m: m
      })
    }
  },
  methods: {
    // 头部事件
    budgetTap() {
      this.setData({
        ["budgetM.show"]: true,
        ["budgetM.verifyTips"]: false,
        budgetM_budget: this.data.m.budget
      })
    },
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
        m: dataU.monthCalc(m, true),
        ["budgetM.show"]: false
      })
      this.saveData()
    },
    // 列表展开
    cellMainTap: function (e: any) {
      let k = e.currentTarget.dataset.i
      this.setData({ [`m.tags.[${k}].isShowSub`]: !this.data.m.tags[k].isShowSub })
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
      let pM = dataU.pioStr2Obj(tag.p)
      let etlM = this.data.editTagListM
      etlM.show = true
      etlM.verifyTips = false
      etlM.i = i
      etlM.p = pM.p
      etlM.pio = pM.pio
      this.setData({ editTagListM: etlM })
    },
    cellSubModalConfirm() {
      this.setData({ ["editTagListM.verifyTips"]: true })
      let d = this.data
      let pM = dataU.pioStr2Obj(d.editTagListM_v)
      if (verifyU.vTips(d.pioTips, pM.p)) {
        return
      }
      let etlM = this.data.editTagListM
      try {
        let eM = d.m.list[etlM.i]
        eM.p = d.editTagListM_v
        this.setData({
          m: dataU.monthCalc(d.m, true),
          ["editTagListM.show"]: false
        })
        this.saveData()
      } catch (e) {
      }
    },
    // 删除
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
              m: dataU.monthCalc(d.m, true),
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
        tagList: dataU.getAddTagList(),
        addM_title: "",
        addM_piov: "",
      })
    },
    tagTap: function (e: any) {
      let i = e.currentTarget.dataset.i
      let tag = this.data.tagList[i] as string
      this.setData({ 'addM_title': tag })
    },
    addModalConfirm() {
      this.setData({ ["addM.verifyTips"]: true })
      let d = this.data
      let pM = dataU.pioStr2Obj(d.addM_piov)
      if (verifyU.vTips(d.addM.title_tips, d.addM_title) ||
        verifyU.vTips(d.pioTips, pM.p)) {
        return
      }
      let tag = {
        tt: d.addM_title,
        p: d.addM_piov,
        t: util.getCurrentDate().replace(`${d.m.date}-`, '')
      }
      d.m.list.unshift(tag)
      this.setData({
        m: dataU.monthCalc(d.m, true),
        ["addM.show"]: false
      })
      this.saveData()
    },
    // 其他方法
    saveData() {
      let tt = dataU.saveMonthData(this.data.m)
      if (!tt) return
      wx.showToast({
        title: tt, icon: 'error', duration: 2000
      })
    }
  },
})
