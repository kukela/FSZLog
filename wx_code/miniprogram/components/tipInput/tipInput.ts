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
  },

  /**
   * 组件的初始数据
   */
  data: {
    tip: ""
  },

  observers: {
    'value': function (v) {
      this.changeTip(v)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputChange: function (e: any) {
      let iv = e.detail.value
      this.changeTip(iv)
      this.triggerEvent('input', { value: iv })
    },
    changeTip(v: string) {
      let tips = this.data.tips
      let tip = ""
      for (const key in tips) {
        let tipM = tips[key]
        if (!tipM.f || !tipM.f(v)) continue
        tip = tipM.t
        break
      }
      this.setData({ tip: tip })
    }
  }
})