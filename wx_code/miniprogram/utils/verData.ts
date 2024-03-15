import dateU from './date.js';

module.exports = {

  update_0_to_1(): string {
    let ydKey = "ydata-"
    let mdKey = "md-"
    let sep = " | "
    let keyList = wx.getStorageInfoSync().keys
    // console.log(keyList)
    let tags: any = {}
    keyList.forEach(key => {
      if (key.indexOf(ydKey) == -1) return
      let str = wx.getStorageSync(key)
      let list = []
      try {
        list = JSON.parse(str)
      } catch (error) {
      }
      list.forEach((m: any) => {
        try {
          if (isNaN(dateU.dateKey2Time(m.date)) ||
            isNaN(parseFloat(m.budget))) return
          let listS = ""
          if (m.list) {
            m.list.forEach((v: any) => {
              try {
                if (!v.tt || !v.t || isNaN(parseFloat(v.p))) return
              } catch (error) {
                return
              }
              listS += `${v.tt}${sep}${v.p}${sep}${v.t}\n`
              let tTime = dateU.dateKey2Time(`${m.date}-${v.t}`)
              if (!tags[v.tt] || tTime > tags[v.tt]) {
                tags[v.tt] = tTime
              }
            });
          }
          let mKey = m.date.slice(0, 7)
          let nM = {
            budget: m.budget,
            listS: listS
          }
          wx.setStorageSync(`${mdKey}${mKey}`, JSON.stringify(nM))
          // console.log(nM)
        } catch (error) {
          return
        }
      });
      wx.removeStorageSync(key)
    });
    keyList = wx.getStorageInfoSync().keys
    // console.log(keyList)

    let tagsList: Array<any> = []
    Object.keys(tags).forEach((k: string) => {
      tagsList.push({ tt: k, t: tags[k] })
    });
    tagsList.sort((a: any, b: any) => b.t - a.t);
    wx.setStorageSync("tags", JSON.stringify(tagsList))
    // console.log(wx.getStorageSync("tags"))

    return ""
  }

}