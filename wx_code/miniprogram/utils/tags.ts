export default {
  // 标签tag
  tagDataKey: "tags",

  getAll(): Array<any> {
    var tagsStr = wx.getStorageSync("tags")
    var tags = []
    try {
      tags = JSON.parse(tagsStr)
    } catch (error) {
    }
    return tags
  }

}