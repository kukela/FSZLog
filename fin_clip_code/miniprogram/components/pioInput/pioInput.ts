Component({

    properties: {
      pio: String,
      p: String,
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
  
    methods: {
      radioChange: function (e: any) {
        this.setData({ pio: e.detail.value })
        this.changeV()
      },
      inputChange: function (e: any) {
        this.setData({ p: e.detail.value })
      },
      inputTap() {
        this.triggerEvent('inputTap')
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
        // this.setData({ v: v })
        this.triggerEvent('v', { value: v })
      }
    }
  })