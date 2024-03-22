export default {
  // 价格转字符串
  price2Str(v: number, _: string = "￥"): string {
    if (isNaN(v)) return ""
    return v % 1 === 0 ? `${v}` : v.toFixed(2)
  },
  // 价格转+-字符串
  price2IOStr(v: number, type: string = "￥"): string {
    var vs = this.price2Str(v, type)
    return parseFloat(vs) > 0 ? `+${vs}` : vs
  },
  // +-价格转obj
  pio2Obj(v: any): any {
    let vv = parseFloat(`${v}`)
    const pio = vv < 0 ? "out" : "in"
    if (vv < 0) vv = Math.abs(vv)
    return { pio: pio, p: vv }
  },
  // 通过key获取对象属性
  key2Obj(obj: any, key: string, defaultValue: any = undefined): any {
    let result = obj, i = 0;
    const paths = key.replace(/\[(\d+)\]/g, '.$1').split('.')
    // console.log(paths, '--')
    while (i < paths.length) {
      result = Object(result)[paths[i]];
      if (result === undefined) {
        return defaultValue;
      }
      i++;
    }
    return result;
  }
}