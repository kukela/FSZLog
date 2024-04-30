export default {
  // 键盘类型 -1（未检测）、0（物理键盘）、1（无物理键盘）
  getKeyboardType(): number {
    const v =  parseInt(wx.getStorageSync("MKKeyboardType"))
    return isNaN(v) ? -1 : v
  },
  setKeyboardType(v: number) {
    wx.setStorageSync("MKKeyboardType", v)
  },
}