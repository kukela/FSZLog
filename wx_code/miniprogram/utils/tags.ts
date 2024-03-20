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
    const i = this.list.findIndex((v: any) => title == v.tt)
    if (i >= 0) {
      this.delTagWithIndex(i)
    }
    this.list.unshift(this.getTag(title))
    return this.list
  },
  delTagWithIndex(i: number) {
    this.list.splice(i, 1)
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