import dataU from '../../utils/data.js'

Component({
  data: {
    date: '',
    startDate: '',
    endDate: '',
    list: <any>[]
  },
  lifetimes: {
    attached: function () {
      const yearList = dataU.getYearDataKeys(true)
      let defYear = dataU.getDefYear()
      let minDate = parseInt(defYear)
      yearList.forEach((v: string) => {
        let vv = parseInt(v)
        if (vv < minDate) {
          minDate = vv
        }
      });
      let list = dataU.year2List(defYear, true)
      this.setData({
        date: defYear,
        startDate: `${minDate}`,
        endDate: dataU.getCurrentYear(),
        list: list
      })
    }
  },
  pageLifetimes: {
    show: function () {
    }
  },
  methods: {
    bindDateChange(e: any) {
      let date = e.detail.value
      this.setData({
        date: date,
        list: dataU.year2List(date, true)
      })
      dataU.setDefYear(date)
    },
    copyTap() {
      console.log("--")
    },
    importTap() {
    },
    cellTitleTap(e: any) {
      let i = e.currentTarget.dataset.i
      let vv = this.data.list[i] as any
      vv.isShowSub = !vv.isShowSub
      this.setData({ list: this.data.list })
    }
  }
})
