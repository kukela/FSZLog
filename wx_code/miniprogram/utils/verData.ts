import dateU from './date.js';

module.exports = {

  update_0_to_1(): string {
    const ydKey = "ydata-"
    const mdKey = "md-"
    const sep = " | "
    let keyList = wx.getStorageInfoSync().keys
    // console.log(keyList)
    const tags: any = {}
    keyList.forEach(key => {
      if (key.indexOf(ydKey) == -1) return
      const str = wx.getStorageSync(key)
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
              const tTime = dateU.dateKey2Time(`${m.date}-${v.t}`)
              if (!tags[v.tt] || tTime > tags[v.tt]) {
                tags[v.tt] = tTime
              }
            });
          }
          const mKey = m.date.slice(0, 7)
          const nM = {
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

    const tagsList: Array<any> = []
    Object.keys(tags).forEach((k: string) => {
      tagsList.push({ tt: k, t: tags[k] })
    });
    tagsList.sort((a: any, b: any) => b.t - a.t);
    wx.setStorageSync("tags", JSON.stringify(tagsList))
    // console.log(wx.getStorageSync("tags"))

    return ""
  }

}