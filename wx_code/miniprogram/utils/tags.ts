export default {
  // 标签tag
  tagDataKey: "tags",
  list: <any>[],

  init() {
    this.list = []
    try {
      this.list = JSON.parse(wx.getStorageSync(this.tagDataKey))
    } catch (error) {
    }
  },
  getTag(title: string): any {
    return { tt: title, t: new Date().getTime() }
  },
  addTagTitle(title: string): Array<any> {
    const tag = this.getTag(title)
    if(!this.list.find((v: any) => tag.tt == v.tt)) this.list.unshift(tag)
    return this.list
  },
  saveTags(): string {
    try {
      const listStr = JSON.stringify(this.list)
      wx.setStorageSync(this.tagDataKey, listStr)
    } catch (error) {
      return "保存失败"
    }
    return ""
  }
}