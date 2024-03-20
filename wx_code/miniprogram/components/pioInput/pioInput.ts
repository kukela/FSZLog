Component({

  /**
   * 组件的属性列表
   */
  properties: {
    pio: String,
    p: String,
    v: String,
    tips: Array,
    verifyTips: {
      type: Boolean,
      value: false
    },
    evalMath: Object,
    showKeyboard: {
      type: Boolean,
      value: false
    },
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

  observers: {
    'p': function (_) {
      this.changeV()
    }
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
    },
    changeV() {
      let v = this.data.p
      let evalM = this.data.evalMath
      if (evalM && evalM.f) {
        v = evalM.f(v)
      } else {
        v = `${parseFloat(v)}`
      }
      if (this.data.pio == "in") {
        v = `+${v}`
      } else {
        v = `-${v}`
      }
      this.setData({ v: v })
    }
  }
})