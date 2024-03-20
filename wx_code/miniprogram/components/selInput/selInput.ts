import tipsU from '../utils/tips.js'

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    mode: String, // selector、date
    // selector
    range: Array,
    // date
    start: String,
    end: String,
    fields: String,
    value: String,

    placeholder: String,
    disabled: Boolean,
    showText: String,
    tips: Array,
    verifyTips: {
      type: Boolean,
      value: false
    },

    rBtnImgSrc: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    tip: ""
  },

  observers: {
    'verifyTips': function (v) {
      if (v) {
        this.changeTip(this.data.value)
      } else {
        this.setData({ tip: "" })
      }
    },
    'tips': function (_) {
      this.changeTip(this.data.value)
    },
    'value': function (v) {
      switch (this.data.mode) {
        case "selector":
          this.selectorValueChange(v)
          break;
        case "date":
          this.dateValueChange(v)
          break;
        default:
          break;
      }
      this.changeTip(v)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tap() {
      this.triggerEvent('myTap')
    },
    change: function (e: any) {
      const v = e.detail.value
      switch (this.data.mode) {
        case "selector":
          this.selectorChange(v)
          break;
        case "date":
          this.dateChange(v)
          break;
        default:
          break;
      }
    },
    selectorChange(v: string) {
      try {
        const d = this.data.range[parseInt(v)]
        if (!d.t || !d.v) return
        this.changeValue(d.v)
      } catch (error) {
        return
      }
    },
    dateChange(v: string) {
      this.changeValue(v)
    },
    changeTip(v: string): string {
      const tip = tipsU.changeTip(this.data, v)
      this.setData({ tip: tip })
      return tip
    },
    changeValue(v: string) {
      this.setData({ value: v })
      const d = this.data
      this.triggerEvent('change', { t: d.showText, v: d.value })
    },
    selectorValueChange(v: string) {
      const m = this.data.range.find((item: any) => item.v == v)
      if (m) this.setData({ showText: m.t })
    },
    dateValueChange(v: string) {
      this.setData({ showText: v })
    },
    rBtnTap() {
      this.triggerEvent('rBtnTap')
    },
  }
})