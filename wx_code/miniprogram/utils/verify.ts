import dateU from './date.js';

export default {

  isNaNFloatFun(v: string): boolean {
    try {
      return isNaN(parseFloat(v))
    } catch (e) {
      return true
    }
  },

  isNaNIntFun(v: string): boolean {
    try {
      return isNaN(parseInt(v))
    } catch (e) {
      return true
    }
  },

  isEmptyFun(v: string): boolean {
    // return !v
    return v == "" || v == undefined || v == null
  },

  isNoDateStrFun(v: string): boolean {
    return isNaN(dateU.str2Time(v))
  },

  vTips(tips: Array<any>, v: string): string {
    let tip = ""
    for (const key in tips) {
      const tipM = tips[key]
      if (!tipM.f || !tipM.f(v)) continue
      tip = tipM.t
      break
    }
    return tip
  },

}