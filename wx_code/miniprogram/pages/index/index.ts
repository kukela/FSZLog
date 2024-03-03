import dataU from '../../utils/data.js';
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
      i2: 0,
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
      let m = dataU.date2DataObj(dataU.getCurrentDateKey())
      if (m == null) {
        m = dataU.newMonthData()
      }
      this.setData({
        m: m
      })
    }
  },
  pageLifetimes: {
    show: function () {
    }
  },
  methods: {
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
      m = dataU.monthCalc(m)
      this.setData({
        m: m,
        ["budgetM.show"]: false
      })
      this.saveData()
    },

    cellMainTap: function (e: any) {
      let i = e.currentTarget.dataset.i
      let vv = this.data.m.list[i] as any
      vv.isShowSub = !vv.isShowSub
      this.setData({ m: this.data.m })
    },

    cellSubTap: function (e: any) {
      let d = e.currentTarget.dataset
      let pM = dataU.pioStr2Obj(d.m.p)
      let etlM = this.data.editTagListM
      etlM.show = true
      etlM.verifyTips = false
      etlM.i = d.i
      etlM.i2 = d.i2
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
      let m = d.m
      try {
        m.list[etlM.i].list[etlM.i2].p = d.editTagListM_v
        this.setData({
          m: dataU.monthCalc(m),
          ["editTagListM.show"]: false
        })
        this.saveData()
      } catch (e) {
      }
    },

    showAddModalTap: function () {
      this.setData({
        ["addM.show"]: true,
        ["addM.verifyTips"]: false,
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
      if (verifyU.vTips(d.addM.title_tips, d.addM_title) ||
        verifyU.vTips(d.pioTips, d.addM_piov)) {
        return
      }

      this.saveData()
    },

    saveData() {

    }
  },
})
