import dataU from '../../utils/data.js'

Component({
  data: {
    m: <any>{},
    tagList: <any>[],

    showBudgetModal: false,
    budgetM_budget: "",

    showEditTagListModal: false,
    editTagListM: {
      i: 0,
      i2: 0,
      p: "",
      pio: "",
    },
    editTagListM_v: "",

    showModal: false,
    addM: {
      title: "",
      pio: "out",
      price: "",
    },
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
        budgetM_budget: m.budget,
        tagList: dataU.getAddTagList()
      })
    }
  },
  pageLifetimes: {
    show: function () {
    }
  },
  methods: {
    budgetTap() {
      this.setData({ showBudgetModal: true })
    },
    budgetModalConfirm() {
      let m = this.data.m
      m.budget = parseFloat(this.data.budgetM_budget)
      m = dataU.monthCalc(m)
      this.setData({ m: m })
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
      pM.i = d.i
      pM.i2 = d.i2
      this.setData({
        showEditTagListModal: true,
        editTagListM: pM
      })
    },
    cellSubModalConfirm() {
      let v = this.data.editTagListM_v
      if (v == "") return
      let etlM = this.data.editTagListM
      let m = this.data.m
      try {
        m.list[etlM.i].list[etlM.i2].p = v
        this.setData({
          m: dataU.monthCalc(m)
        })
        this.saveData()
      } catch (e) {
      }
    },
    showAddModalTap: function () {
      this.setData({ showModal: true })
    },
    tagTap: function (e: any) {
      let i = e.currentTarget.dataset.i
      let tag = this.data.tagList[i] as string
      this.setData({ 'addM.title': tag })
    },
    addModalConfirm() {
      console.log("----" + this.data.addM_piov)
    },
    saveData() {

    }
  },
})
