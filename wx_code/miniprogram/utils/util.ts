export default {
  // 价格转字符串
  price2Str(v: number, _: string = "￥"): string {
    return v % 1 === 0 ? `${v}` : v.toFixed(2)
  },
  // 价格转+-字符串
  price2IOStr(v: number, type: string = "￥"): string {
    let vs = `${v}`
    if (vs.indexOf('.') > -1) vs = this.price2Str(v, type)
    if (v > 0) vs = `+${vs}`
    return vs
  },
  // 价格字符串转+-字符串
  pioStr2IOStr(v: string, type: string = "￥"): string {
    return this.price2IOStr(parseFloat(v), type)
  },
  // +-字符串转obj
  pioStr2Obj(v: string): any {
    let sL = v.substr(0, 1)
    let vv = v.substring(1)
    let pio = ""
    if (sL == "-") {
      pio = "out"
    } else if (sL == "+") {
      pio = "in"
    } else {
      vv = v
    }
    return {
      pio: pio,
      p: vv
    }
  },
}