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
      budget: 0.0,
    },

    editTagListM: {
      show: false,
      i: 0,
      i2: 0,
      p: "",
      pio: ""
    },
    editTagListM_v: "",

    showModal: false,
    tagList: <any>[],
    addM: {
      pio: "out",
      tips: [{
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
        m: m,
        ["budgetM.budget"]: m.budget
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
        ["budgetM.budget"]: this.data.m.budget
      })
    },
    budgetM_budgetInput(e: any) {
      let v = parseFloat(e.detail.value)
      this.setData({ ["budgetM.budget"]: v })
    },
    budgetModalConfirm() {
      let bM = this.data.budgetM
      if (isNaN(bM.budget)) return
      let m = this.data.m
      m.budget = bM.budget
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
      etlM.i = d.i
      etlM.i2 = d.i2
      etlM.p = pM.p
      etlM.pio = pM.pio
      this.setData({ editTagListM: etlM })
    },
    cellSubModalConfirm() {
      let v = this.data.editTagListM_v
      if (v == "" || v == undefined) {
        this.setData({ ["editTagListM.piovITips"]: true })
        return
      }
      let etlM = this.data.editTagListM
      let m = this.data.m
      try {
        m.list[etlM.i].list[etlM.i2].p = v
        this.setData({
          m: dataU.monthCalc(m),
          ["editTagListM.piovITips"]: false,
          ["editTagListM.show"]: false
        })
        this.saveData()
      } catch (e) {
      }
    },

    showAddModalTap: function () {
      this.setData({
        showModal: true,
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
    },
    saveData() {

    }
  },
})
