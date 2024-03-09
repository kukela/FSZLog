export default {

  vFloatFun(v: string) {
    let vv = NaN
    try {
      vv = parseFloat(v)
    } catch (e) {
    }
    return isNaN(vv)
  },

  vNullFun(v: string) {
    return !v
    // return v == "" || v == undefined || v == null
  },

  vTips(tips: Array<any>, v: string): string {
    let tip = ""
    for (const key in tips) {
      let tipM = tips[key]
      if (!tipM.f || !tipM.f(v)) continue
      tip = tipM.t
      break
    }
    return tip
  }

}