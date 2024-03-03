export default {

  vFloatFun(v: string) {
    let vv = -1.0
    try {
      vv = parseFloat(v)
    } catch (e) {
    }
    return vv < 0 || isNaN(vv)
  },

  vNullFun(v: string) {
    return !v
    // return v == "" || v == undefined || v == null
  }

}