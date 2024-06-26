import tipsU from '../utils/tips.js'

Component({

  properties: {
    type: String,
    placeholder: String,
    disabled: Boolean,
    value: String,
    tips: Array,
    maxlength: {
      type: Number,
      value: 140
    },
    verifyTips: {
      type: Boolean,
      value: false
    },
    unit: String,
    password: Boolean,
  },

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
      this.changeTip(v)
    }
  },

  methods: {
    inputChange: function (e: any) {
      let v = e.detail.value
      this.changeValue(v)
    },
    changeTip(v: string): string {
      const tip = tipsU.changeTip(this.data, v)
      this.setData({ tip: tip })
      return tip
    },
    changeValue(v: string) {
      this.setData({ value: v })
      this.triggerEvent('input', { value: v })
    },
    inputTap() {
      if (this.data.disabled) return
      this.triggerEvent('inputTap')
    }
  }
})