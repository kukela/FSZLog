export default {

  changeTip(data: any, v: string): string {
    if (!data.verifyTips) return ""
    let tips = data.tips
    let tip = ""
    for (const key in tips) {
      const tipM = tips[key]
      if (!tipM.f || !tipM.f(v)) continue
      tip = tipM.t
      break
    }
    return tip
  }

}