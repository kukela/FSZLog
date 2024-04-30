import evalM from './eval_math.js';
import S from './storage.js';

let iCursor = -1

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
    isExtKeyboard: false,
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
          { class: "lt", t: "+" }, { t: "1" }, { t: "2" }, { t: "3" }
        ]
      },
      {
        list: [
          { class: "lt", t: "-" }, { t: "4" }, { t: "5" }, { t: "6" }
        ]
      },
      {
        list: [
          { class: "lt", t: "*" }, { t: "7" }, { t: "8" }, { t: "9" }
        ]
      },
      {
        list: [
          { class: "lt", t: "/" }, { t: "." }, { t: "0" }, { class: "ok", t: "确定" }
        ]
      },
    ],
    isVErr: false,
    isShowEQ: false,
    inputValue: "",
    inputCursor: -1,
    keyBtnBC: <any>{},
    inputList: <any>[],
    stRS: 0,
    stRE: 0
  },
  observers: {
    'show': function (v) {
      if (this.data.show2 == v) return
      if (v) {
        this.initInputData()
        wx.hideTabBar({})
        S.setKeyboardType(1)
        this.setData({ isExtKeyboard: false })
        // this.checkExtKeyboard()
      } else {
        wx.showTabBar({})
      }
      setTimeout(() => {
        this.setData({ show2: v })
      }, v ? 0 : 180);
    }
  },
  methods: {
    reCheckExtKeyboard() {
      S.setKeyboardType(-1)
      this.checkExtKeyboard()
      setTimeout(() => {
        if (S.getKeyboardType() == 1) return
        wx.showToast({ title: "支持物理键盘", icon: "none" })
      }, 500);
    },
    checkExtKeyboard() {
      const kType = S.getKeyboardType()
      const d = this.data
      if (!d.isExtKeyboard) {
        this.setInputV(d.inputList, [])
      }
      this.setData({ isExtKeyboard: kType != 1 })
      if (kType >= 0) return
      S.setKeyboardType(0)
    },
    onFocus() {
      // console.log("onFocus", inputCursor)
    },
    onKeyboardHeightChange() {
      wx.hideKeyboard()
      this.setData({ isExtKeyboard: false })
      S.setKeyboardType(1)
      this.setInputVList() 
      wx.showToast({ title: "无物理键盘", icon: "none" })
    },
    onBlur(e: any) {
      const d = this.data
      if (d.isExtKeyboard) {
        iCursor = e.detail.cursor
        if (typeof d.keyBtnBC == "function") d.keyBtnBC()
        this.setData({ isExtKeyboard: true })
      }
      console.log("onBlur", iCursor)
    },
    onInput(e: any) {
      let value = e.detail.value
      const regex = /[^0-9+\-\*\/\.\(\)]/g
      const v = value.replace(regex, '');
      this.setData({ inputValue: v })
      if (value != v) {
        let kv = value.match(regex).join('')
        let kvE = encodeURIComponent(kv)
        switch (kvE) {
          case "%0A":
            this.onKey("确定")
            return
          case "w": case "W":
            iCursor = e.detail.cursor - 1
            this.onKey("万")
            return
        }
        this.showKeyError(kv)
        return
      }
      this.calcInput()
    },
    onInputConfirm(_: any) {
      this.onKey("确定")
    },
    inputTap(e: any) {
      iCursor = e.currentTarget.dataset.i
      if (iCursor < 0) iCursor = 0
      if (isNaN(iCursor)) iCursor = -1
      this.setData({
        inputCursor: iCursor,
      })
      // console.log(iCursor)
    },
    cInputLongTap() {
      this.setData({
        stRS: 0,
        stRE: this.data.inputList.length - 1
      })
      // wx.getSelectedTextRange({
      //   complete: (res: any) => {
      //     console.log('getSelectedTextRange res', res)
      //   }
      // })
    },
    btnTap(e: any) {
      const v = e.currentTarget.dataset.v
      if (this.data.isExtKeyboard) {
        let bc = () => {
          this.setData({ keyBtnBC: null })
          this.onKey(v)
        }
        this.setData({ keyBtnBC: bc })
        return
      }
      this.onKey(v)
    },
    onKey(v: string) {
      let d = this.data
      if (d.isExtKeyboard) {
        this.setInputVList()
      }
      const list = this.data.inputList
      if (iCursor < 0) iCursor = list.length
      let list1 = list.slice(0, iCursor)
      let list2 = list.slice(iCursor)
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
          list1 = this.wan(list1)
          break;
        case "<":
          list1.pop()
          break;
        case "0": case "1": case "2": case "3": case "4": case "5":
        case "6": case "7": case "8": case "9": case ".": case "+":
        case "-": case "*": case "/": case "(": case ")":
          list1.push(v)
          break
        default:
          this.showKeyError(v)
          return;
      }
      if (d.isExtKeyboard) {
        this.setInputV(list1, list2)
      } else {
        iCursor = list1.length
        this.setData({ inputList: [...list1, ...list2], inputCursor: iCursor })
      }
      this.calcInput()
    },
    showKeyError(k: string) {
      wx.showToast({ title: `${k}键不支持`, icon: "error" })
    },
    setInputVList() {
      let iv = this.data.inputValue
      if (iCursor > iv.length || iCursor < 0) iCursor = iv.length
      this.setData({
        inputList: iv.split(''),
        inputCursor: iCursor
      })
    },
    setInputV(list1: Array<String>, list2: Array<String>) {
      const nv = [...list1, ...list2].join('')
      iCursor = list1.length
      this.setData({ inputValue: nv, inputCursor: iCursor })
    },
    calcInput() {
      const d = this.data
      const inputV = d.isExtKeyboard ? d.inputValue : d.inputList.join('')
      const sv = evalM.evalMath(inputV)
      if (isNaN(sv)) {
        this.setData({ v: 0, isShowEQ: false, isVErr: inputV.length != 0 })
      } else {
        this.setData({ v: parseFloat(sv.toFixed(10)), isShowEQ: true, isVErr: false })
      }
    },
    initInputData() {
      const v = this.data.v
      if (v == 0) return
      const vs = `${v}`
      this.setData({
        inputValue: vs,
        inputCursor: iCursor = -1,
        keyBtnBC: null,
        isVErr: false,
        inputList: vs.split('')
      })
    },
    defData() {
      this.setData({
        isShowEQ: false,
        isVErr: false,
        inputValue: "",
        inputCursor: iCursor = -1,
        keyBtnBC: null,
        inputList: [],
        stRS: 0,
        stRE: 0,
        v: 0,
      })
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
      v = parseFloat((v * 10000.0).toFixed(10))
      const vsList = `${v}`.split('')
      nList.push(...vsList)
      // console.log(nList)
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