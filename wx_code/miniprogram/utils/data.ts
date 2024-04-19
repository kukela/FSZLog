import conf from './conf.js';
import dateU from './date.js';
import verify from './verify.js';
import IOData from './IOData.js'
import IMData from './IMData.js'
import anim from './anim.js';
import syncD from './syncData.js';
import S from './storage.js';

export default {
  sep: " | ",

  // app打开初始化数据
  // 需要注意不同步到云
  init() {
    syncD.init()
    IMData.init(null, false)
    this.checkCurrentMonthData()
    this.checkRepMonth()
  },
  // 检查当月数据并生成，返回当月数据
  checkCurrentMonthData(): any {
    let m = this.date2DataObj(dateU.getCurrentYearMonth(), 2)
    if (!m) {
      m = this.newMonthData()
      IOData.saveMonthData(m, false)
    }
    return m
  },
  // 获取下月数据
  getNextMonthData(): any {
    const ndKey = dateU.getYearMonth(dateU.monthPlus(new Date()))
    return this.newMonthData(ndKey)
  },
  // 新建月份数据
  newMonthData(date: String = "", budget: number = 0): any {
    if (!date) date = dateU.getCurrentYearMonth()
    if (budget <= 0) budget = conf.getDefBudget()
    const nm = {
      budget: budget,
      date: date,
      listS: ""
    }
    this.monthCalc(nm, 2)
    return nm
  },
  // 检查是否需要补月
  checkRepMonth() {
    const mList = this.getMonthDataKeys(true, 1)
    if (mList.length < 2) return
    const date = dateU.str2Date(mList[0])
    const en = dateU.date2YMNum(dateU.str2Date(mList[mList.length - 1]))
    let budget = conf.nullDefBudget
    while (dateU.date2YMNum(date) < en) {
      const mStr = dateU.getYearMonth(date)
      dateU.monthPlus(date)
      if (mList.includes(mStr)) {
        const pm = this.date2DataObj(mStr, -1)
        if (!isNaN(pm.budget)) budget = pm.budget
        continue
      }
      const pm = this.newMonthData(mStr, budget)
      IOData.saveMonthData(pm, false)
    }
  },
  /**
   * 获取所有月数据key
   * @param isMonth 返回月份
   * @param sort 0（不排序）、1（从小到大）、2（从大到小）
   * @param year 按照年筛选
   */
  getMonthDataKeys(isMonth: boolean, sort: number = 0, year: string = ""): string[] {
    const keys = wx.getStorageInfoSync().keys
    const list: string[] = []
    const fKey = S.monthDataHKey + year
    keys.forEach(v => {
      if (v.indexOf(fKey) == -1) return
      const m = v.replace(S.monthDataHKey, '')
      if (isNaN(dateU.str2Time(m))) {
        S.removeMonthData(m)
        return
      }
      list.push(isMonth || sort > 0 ? m : v)
    })
    if (sort <= 0) return list
    this.sortYearData(list, sort)
    if (!isMonth) {
      list.forEach((v, i) => {
        list[i] = v
      });
    }
    return list
  },
  // 获取所有年 从大到小
  getAllYears(): string[] {
    const yM = new Set<string>()
    const mList = this.getMonthDataKeys(true, 2)
    mList.forEach(v => {
      yM.add(v.slice(0, 4))
    });
    const nL = Array.from(yM)
    nL.sort((a: string, b: string) => {
      try {
        return parseInt(b) - parseInt(a)
      } catch (e) {
        return 0
      }
    });
    return nL
  },
  /**
   * 通过年key获取数据
   * @param year 年
   * @param sort 0（不排序）、1（从小到大）、2（从大到小）
   */
  year2List(year: string, sort: number = 0): any[] {
    const yKeys = this.getMonthDataKeys(false, 2, year)
    // console.log(yKeys)
    const list: any[] = []
    yKeys.forEach((k: string) => {
      const d = this.date2DataObj(k, sort)
      if (d) list.push(d)
    });
    return list
  },
  /**
   * 通过月份日期获取月份数据
   * @param date 年-月
   * @param sort 0（不排序）、1（从小到大）、2（从大到小）
   */
  date2DataObj(mdateStr: string, sort: number = 0): any {
    const m = S.getMonthData(mdateStr)
    if (m == null) return null
    try {
      m.date = mdateStr
      if (m.listS) {
        const cTime = new Date().getTime();
        const nList: Array<any> = []
        m.listS.split("\n").forEach((v: string) => {
          const tag = this.tagData2Obj(v, cTime, m.date)
          if (!tag) return
          nList.push(tag)
        });
        m.list = nList
        m.listS = ""
      }
      if (!m.list) m.list = []
      if (sort >= 0) this.monthCalc(m, sort)
      return m
    } catch (e) {
      console.error(e)
    }
    return null
  },
  /**
   * 计算月份要显示的数据
   * @param m 月数据
   * @param sort 0（不排序）、1（从小到大）、2（从大到小）
   */
  monthCalc(m: any, sort: number = 0, isGenTagsGroup: boolean = false): any {
    if (!m) return m
    if (!m.list) m.list = []
    IMData.imDataAdd2MonthData(m)
    this.sortMonthTagData(m, sort)
    m.aP = 0.0
    m.list.forEach((v: any) => {
      m.aP += parseFloat(v.p)
    });
    m.sP = m.budget + m.aP
    m.per = Math.abs(m.aP) / m.budget * 100
    if (m.per > 100) m.per = 100
    if (m.per < 0) m.per = 0
    if (m.per >= 95) {
      m.perType = 3
    } else if (m.per >= 80) {
      m.perType = 2
    } else {
      m.perType = 1
    }
    m.isSS = false
    m.isSSA = false
    if (isGenTagsGroup) this.genMonthTagsGroup(m)
    return m
  },
  /**
   * tag数据字符串转obj
   * @param v 数据字符串
   * @param cTime 当前时间戳
   * @param date 月份日期
   */
  tagData2Obj(v: string, cTime: number = 0, date: string = ""): any {
    if (!v) return null
    const tdList = v.split(this.sep)
    if (tdList.length < 3) return null
    const tt = tdList[0]
    const p = tdList[1]
    const t = tdList[2]
    const tDate = dateU.str2Date(date ? `${date}-${t}` : t)
    const tTime = tDate.getTime()
    if (verify.isEmptyFun(tt) || verify.isNaNFloatFun(p) || isNaN(tTime)) return null
    if (cTime > 0 && tTime > cTime) return null
    return { tt: tt, p: parseFloat(p), t: t }
  },
  // 生成月份tag数组
  genMonthTagsGroup(m: any) {
    if (!m || !m.list) return
    const tags: Array<any> = []
    m.list.forEach((v: any, i: number) => {
      let tM = tags.find((item: any) => item.tag == v.tt)
      if (!tM) {
        tM = { tag: v.tt }
        if (v.isNS) tM.isNS = true
        tags.push(tM)
      }
      let tList = tM.list
      if (!tList) tList = []
      tList.push({
        t: v.t,
        p: v.p,
        i: i,
      })
      tM.list = tList
    });
    tags.forEach((v: any) => {
      v.aP = 0.0
      v.list.forEach((vv: any) => {
        v.aP += parseFloat(vv.p)
      });
    });
    anim.coverIsShowSub(tags, m.tags, "tag")
    m.tags = tags
  },
  // 排序年内数据
  sortYearData(list: Array<any>, sort: number = 2) {
    list.sort((a: string, b: string) => {
      try {
        if (sort == 2) {
          return dateU.str2Time(b) - dateU.str2Time(a)
        } else {
          return dateU.str2Time(a) - dateU.str2Time(b)
        }
      } catch (e) {
        return 0
      }
    });
  },
  // 排序月份tag数据
  sortMonthTagData(m: any, sort: number = 0) {
    if (sort == 0) return
    m.list.sort((a: any, b: any) => {
      try {
        if (sort == 2) {
          return dateU.str2Time(`${m.date}-${b.t}`) - dateU.str2Time(`${m.date}-${a.t}`)
        } else {
          return dateU.str2Time(`${m.date}-${a.t}`) - dateU.str2Time(`${m.date}-${b.t}`)
        }
      } catch (e) {
        console.error(e)
        return 0
      }
    });
  },
  // 覆盖年份的isShowSub数据
  coverYearIsShowSub(newL: Array<any>, oldL: Array<any>) {
    anim.coverIsShowSub(newL, oldL, "date")
  },
}
