import data from './data.js';
import dateU from './date.js';
import verify from './verify.js';

export default {
  sep: " | ",
  budget_type: "-$budget-",
  // 年数组数据转导出格式字符串
  yearList2CopyStr(list: Array<any>): string {
    let nList = JSON.parse(JSON.stringify(list))
    let str = ""
    let sepS = this.sep
    nList = data.sortMonthData(nList, false)
    nList.forEach((v: any) => {
      str += `${this.budget_type}${sepS}${v.budget}${sepS}${v.date}\n`
      data.sortMonthTagData(v, false)
      v.list.forEach((vv: any) => {
        str += `${vv.tt}${sepS}${vv.p}${sepS}${v.date}-${vv.t}\n`
      });
    });
    return str
  },
  // 导入年数据字符串
  importYearListStr(str: String): Array<any> {
    let list: Array<any> = []
    let cTime = new Date().getTime();
    str.split("\n").forEach(v => {
      let tDList = v.split(this.sep)
      if (tDList.length < 3) return
      let tt = tDList[0]
      let p = tDList[1]
      let t = tDList[2]
      let tDate = dateU.dateKey2Date(t)
      let tTime = tDate.getTime()
      if (verify.vNullFun(tt) || verify.vFloatFun(p) || isNaN(tTime)) return
      if (tTime > cTime) return
      let tag = { tt: tt, p: p, t: "" }
      if (tt == this.budget_type) {
        tag.t = dateU.getYearMonthKey(tDate)
      } else {
        tag.t = t
      }
      list.push(tag)
    });
    return list
  },
  // 导入数组
  importListData(list: Array<any>): string {
    let yM: any = {}
    list.forEach(v => {
      let key = v.t.length > 7 ? v.t.slice(0, 7) : v.t
      let year = key.slice(0, 4)
      let m = yM[year]
      if (!m) m = {}
      let mm = m[key]
      if (!mm) mm = {}
      if (v.tt == this.budget_type) {
        mm.budget = parseFloat(v.p)
      } else {
        let list = mm.list
        if (!list) list = []
        v.t = v.t.replace(`${key}-`, '')
        list.push(v)
        mm.list = list
      }
      m[key] = mm
      yM[year] = m
    });
    let keys = Object.keys(yM)
    if (keys.length < 1) return "没有数据可导入"
    let isAllOk = true
    keys.forEach(year => {
      let mm = yM[year]
      let list = data.year2List(year, false)
      Object.keys(mm).forEach(key => {
        let m = mm[key]
        let isChange = false
        list.forEach((v) => {
          if (v.date == key) {
            v.budget = m.budget
            v.list = m.list
            isChange = true
          }
        });
        if (!isChange) {
          m.date = key
          list.push(m)
        }
      })
      if (!data.saveYearList(year, list)) {
        isAllOk = false
      }
    });
    return isAllOk ? "" : "部分数据错误"
  },
  // 文字去敏
  strDes(v: string): string {
    return v.replace(/[ \f\n\r\t\v]/g, "_")
      .replace(/\-\$budget\-/g, "_")
  },
}