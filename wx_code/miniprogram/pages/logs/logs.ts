Component({
  data: {
    date: '',
    startDate: '',
    endDate: '',
  },
  lifetimes: {
    attached: function () {
      this.setData({
        date: this.getDate(null),
        startDate: this.getDate('start'),
        endDate: this.getDate('end')
      })
    }
  },
  pageLifetimes: {
    show: function () {
    }
  },
  methods: {
    bindDateChange: function (e: any) {
      this.setData({
        date: e.detail.value
      })
    },
    getDate(type: any) {
      const date = new Date();
      let year = date.getFullYear();
      if (type === 'start') {
        year = year - 2;
      }
      return `${year}`;
    }
  }
})
