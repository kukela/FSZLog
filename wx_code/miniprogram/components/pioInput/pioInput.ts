// components/pioInput/pioInput.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    pio: String,
    p: String,
    v: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [
      { "title": "收入", "v": "in" },
      { "title": "支出", "v": "out" },
    ],
  },

  pageLifetimes: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    radioChange: function (e: any) {
      this.setData({ pio: e.detail.value })
      this.changeV()
    },
    inputChange: function (e: any) {
      this.setData({ p: e.detail.value })
      this.changeV()
    },
    changeV() {
      let v = this.data.p
      if (this.data.pio == "in") {
        v = `+${v}`
      } else {
        v = `-${v}`
      }
      this.setData({ v: v })
    }
  }
})