Component({

  /**
   * 组件的属性列表
   */
  properties: {
    type: String,
    placeholder: String,
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
      this.changeValue(this.data.value)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputChange: function (e: any) {
      let v = e.detail.value
      this.changeValue(v)
      this.triggerEvent('input', e.detail)
    },
    changeTip(v: string): string {
      let tips = this.data.tips
      let tip = ""
      for (const key in tips) {
        let tipM = tips[key]
        if (!tipM.f || !tipM.f(v)) continue
        tip = tipM.t
        break
      }
      this.setData({ tip: tip })
      return tip
    },
    changeValue(v: string) {
      if (this.changeTip(v)) {
        this.setData({ value: "" })
      } else {
        this.setData({ value: v })
      }
    }
  }
})