import evalM from './eval_math.js';

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    v: {
      type: Number,
      value: 0
    },
  },
  data: {
    show2: false,
    list: [
      {
        class: "t",
        list: [
          { class: "lt cancel", t: "取消" },
          { class: "s", t: "(" }, { class: "s", t: ")" }, { class: "w", t: "万" },
          { class: "d", t: "<" },
        ]
      },
      {
        list: [
          { class: "lt", t: "/" }, { t: "7" }, { t: "8" }, { t: "9" }
        ]
      },
      {
        list: [
          { class: "lt", t: "*" }, { t: "4" }, { t: "5" }, { t: "6" }
        ]
      },
      {
        list: [
          { class: "lt", t: "-" }, { t: "1" }, { t: "2" }, { t: "3" }
        ]
      },
      {
        list: [
          { class: "lt", t: "+" }, { t: "." }, { t: "0" }, { class: "ok", t: "确定" }
        ]
      },
    ],
    isShowEQ: false,
    inputList1: <any>[],
    inputList2: <any>[]
  },
  observers: {
    'show': function (v) {
      if (this.data.show2 == v) return
      if (v) {
        this.initInputList()
        wx.hideTabBar({})
      } else {
        wx.showTabBar({})
      }
      setTimeout(() => {
        this.setData({ show2: v })
      }, v ? 0 : 180);
    }
  },
  methods: {
    inputTap(e: any) {
      const i = e.currentTarget.dataset.i + 1
      const inputList = this.getInputList()
      this.setData({
        inputList1: inputList.slice(0, i),
        inputList2: inputList.slice(i)
      })
      // console.log(this.data.inputList1, this.data.inputList2)
    },
    btnTap(e: any) {
      const v = e.currentTarget.dataset.v
      let inputList1 = this.data.inputList1
      let inputList2 = this.data.inputList2
      // console.log(v)
      switch (v) {
        case "取消":
          this.defData()
          this.cancel()
          return;
        case "确定":
          this.ok()
          this.defData()
          return;
        case "万":
          inputList1 = this.wan(inputList1)
          break;
        case "<":
          inputList1.pop()
          break;
        default:
          inputList1.push(v)
          break;
      }
      this.setData({ inputList1: inputList1, inputList2: inputList2 })
      const inputList = this.getInputList()
      // console.log(inputList.join(''))
      const sv = evalM.evalMath(inputList.join(''))
      if (!isNaN(sv)) {
        this.setData({ v: parseFloat(sv.toFixed(10)), isShowEQ: true })
        return
      }
      if (inputList.length == 0) this.setData({ v: 0, isShowEQ: false })
    },
    btnLongTap(e: any) {
      const v = e.currentTarget.dataset.v
      if (v == "<") {
        this.defData()
      }
    },
    initInputList() {
      if (this.data.v == 0) return
      this.setData({
        inputList1: `${this.data.v}`.split(''),
        inputList2: []
      })
    },
    defData() {
      this.setData({
        isShowEQ: false,
        inputList1: [], inputList2: [],
        v: 0
      })
    },
    getInputList(): any[] {
      const d = this.data
      return [...d.inputList1, ...d.inputList2]
    },
    wan(list: any[]): any[] {
      if (list.length <= 0) return list
      let nI = -1
      for (let i = list.length - 1; i >= 0; i--) {
        const v = list[i]
        switch (v) {
          case "0": case "1": case "2": case "3": case "4":
          case "5": case "6": case "7": case "8": case "9":
          case ".":
            break;
          default:
            nI = i + 1
            break;
        }
        if (nI >= 0) break
      }
      if (nI < 0) nI = 0
      let v = parseFloat(list.slice(nI).join(''))
      if (isNaN(v)) return list
      const nList = list.slice(0, nI)
      v *= 10000
      const vsList = `${v}`.split('')
      nList.push(...vsList)
      console.log(nList)
      return nList
    },
    cancel() {
      this.setData({ show: false })
    },
    ok() {
      this.triggerEvent('ok', { v: this.data.v })
      this.setData({ show: false })
    }
  }
})