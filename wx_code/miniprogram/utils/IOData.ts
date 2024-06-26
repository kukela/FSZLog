import conf from './conf.js';
import data from './data.js';
import dateU from './date.js';
import IMData from './IMData.js';
import verify from './verify.js';
import util from './util.js';
import S from './storage.js';

export default {
  sep: " | ",
  budget_type: "-$budget-",
  budget_type2: "-$B-",
  // 年数组数据转导出格式字符串
  yearList2CopyStr(list: Array<any>): string {
    const nList = JSON.parse(JSON.stringify(list))
    let str = ""
    const sep = this.sep
    data.sortYearData(nList, 2)
    nList.forEach((v: any) => {
      if(v.isNMData) return
      str += `${this.budget_type2}${sep}${v.budget}${sep}${v.date}\n`
      data.sortMonthTagData(v, 2)
      v.list.forEach((vv: any) => {
        if (vv.isNS) return
        str += `${vv.tt}${sep}${util.price2IOStr(vv.p)}${sep}${v.date}-${vv.t}\n`
      });
    });
    return str
  },
  // 导入年数据字符串
  importYearListStr(str: String): Array<any> {
    const list: Array<any> = []
    const cTime = new Date().getTime();
    const sS = this.sep
    str.split("\n").forEach(v => {
      const tDList = v.split(sS)
      if (tDList.length < 3) return
      const tt = tDList[0]
      const p = tDList[1]
      const t = tDList[2]
      const tDate = dateU.str2Date(t)
      const tTime = tDate.getTime()
      if (verify.isEmptyFun(tt) || verify.isNaNFloatFun(p) || isNaN(tTime)) return
      if (tTime > cTime) return
      const tag = { tt: tt, p: parseFloat(p), t: "" }
      if (tt == this.budget_type || tt == this.budget_type2) {
        tag.t = dateU.getYearMonth(tDate)
      } else {
        tag.t = t
      }
      list.push(tag)
    });
    return list
  },
  // 导入数组
  importListData(list: Array<any>): string {
    const mM: any = {}
    console.log(list)
    list.forEach((v: any) => {
      const key = v.t.length > 7 ? v.t.slice(0, 7) : v.t
      let m = mM[key]
      if (!m) {
        m = {}
        mM[key] = m
      }
      if (v.tt == this.budget_type || v.tt == this.budget_type2) {
        m.budget = parseFloat(v.p)
      } else {
        v.t = v.t.replace(`${key}-`, '')
        v.tt = this.strDes(v.tt)
        if (!m.list) {
          m.list = [v]
        } else {
          m.list.push(v)
        }
      }
      if (isNaN(m.budget)) {
        m.budget = conf.getDefBudget()
      }
    });
    console.log(mM)
    const keys = Object.keys(mM)
    if (keys.length < 1) return "没有数据可导入"
    let isAllOk = true
    keys.forEach(month => {
      const mm = mM[month]
      mm.date = month.replace(S.monthDataHKey, "")
      const st = this.saveMonthData(mm)
      if (st) {
        isAllOk = false
      }
    });
    return isAllOk ? "" : "部分数据错误"
  },
  // 保存月数据
  saveMonthData(m: any, isSync: boolean = true): string {
    if (!m || !m.date || isNaN(m.budget)) {
      return "内容不全！"
    }
    if (isNaN(dateU.str2Date(m.date).getTime())) return "日期格式错误！"
    const sep = this.sep
    let listS = ""
    if (m.list) {
      data.sortMonthTagData(m, 2)
      m.list.forEach((v: any) => {
        if (v.isNS) return
        listS += `${v.tt}${sep}${v.p}${sep}${v.t}\n`
      });
    }
    const sM = {
      budget: m.budget,
      listS: listS
    }
    try {
      S.setMonthData(m.date, JSON.stringify(sM), isSync)
    } catch (error) {
      return "JSON格式转换失败"
    }
    return ""
  },
  // 分期数据转导出字符串
  imData2CopyStr(list: Array<any>, listC: Array<any>): string {
    return IMData.list2SaveStr([...list, ...listC], this.sep)
  },
  // 导入分期数据字符串
  importIMDataStr(str: String): Array<any> {
    const list: Array<any> = []
    const idList = new Set()
    str.split("\n").forEach(v => {
      const m = IMData.str2IMDataObj(v)
      if (!m) return
      if (idList.has(m.id)) IMData.genDataId(m)
      idList.add(m.id)
      list.push(m)
    });
    return list
  },
  // 导入分期数组
  importIMListData(list: Array<any>): string {
    IMData.init(list)
    let isAllOk = true
    return isAllOk ? "" : "部分数据错误"
  },
  // 文字去敏
  strDes(v: string): string {
    return v.replace(/[\f\n\r\t\v]/g, "_")
      .replace(/\-\$budget\-/g, "_").trim()
  },
}