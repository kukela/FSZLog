import tipsU from '../utils/tips.js'

Component({

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
    tips: Array,
    verifyTips: {
      type: Boolean,
      value: false
    },

    rBtnImgSrc: String,
  },

  data: {
    tip: "",
    // v: "",
    showText: ""
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
    selectorChange(v: number) {
      try {
        const d = this.data.range[v]
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
      const mI = this.data.range.findIndex((item: any) => item.v == v)
      const m = this.data.range[mI]
      if (m) this.setData({ showText: m.t, v: mI })
    },
    dateValueChange(v: string) {
      this.setData({ showText: v, v: v })
    },
    rBtnTap() {
      this.triggerEvent('rBtnTap')
    },
  }
})