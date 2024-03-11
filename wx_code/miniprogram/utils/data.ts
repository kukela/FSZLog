import conf from './conf.js';
import dateU from './date.js';
import util from './util.js';

export default {
  // app打开初始化数据
  initData() {
    // require('./test.js').initTestData()
  },
  // 新建当月的月份数据
  newMonthData(): any {
    let nm = {
      "date": dateU.getCurrentDateKey(),
      "budget": conf.getDefBudget(),
      "list": []
    }
    return this.monthCalc(nm, true)
  },
  // 获取月数据key
  getMonthDataKey(year: string, month: string): string {
    return `${year}-${month}`
  },
  // 获取所有年数据key
  getYearDataKeys(isYear: boolean = false): string[] {
    try {
      var rList: string[] = []
      const list = wx.getStorageInfoSync().keys
      list.forEach((v, _) => {
        if (v.indexOf(conf.yearDataKey) !== -1) {
          rList.push(isYear ? v.replace(conf.yearDataKey, '') : v)
        }
      })
      return rList
    } catch (e) {
      return []
    }
  },
  // 通过年key获取数据
  year2List(year: string, isCalc: boolean): any[] {
    try {
      let str = wx.getStorageSync(conf.getYearDataKey(year))
      let list = JSON.parse(str)
      list = this.sortMonthData(list)
      if (!isCalc) return list
      list.forEach((v: any) => {
        this.monthCalc(v, false)
      });
      return list
    } catch (e) {
      console.error(e)
      return []
    }
  },
  // 通过日期和数组获取月份数据
  month2DataObj(yearList: any[], date: string): any {
    for (let key in yearList) {
      let m = yearList[key]
      if (m.date == date) return m
    }
    return null
  },
  // 通过日期获取月份数据
  date2DataObj(v: string): any {
    let dList = v.split("-");
    if (dList.length > 0) {
      let yList = this.year2List(dList[0], false)
      if (yList == null) return null
      let m = this.month2DataObj(yList, v)
      if (m == null) return null
      return this.monthCalc(m, true)
    }
    return null
  },
  // 排序月份数据
  sortMonthData(list: Array<any>, isReverse: boolean = true): Array<any> {
    return list.sort((a: any, b: any) => {
      try {
        if (isReverse) {
          return dateU.dateKey2MonthNum(b.date) - dateU.dateKey2MonthNum(a.date)
        } else {
          return dateU.dateKey2MonthNum(a.date) - dateU.dateKey2MonthNum(b.date)
        }
      } catch (e) {
        console.error(e)
        return 0
      }
    });
  },
  // 排序月份tag数据
  sortMonthTagData(m: any, isReverse: boolean = true) {
    m.list = m.list.sort((a: any, b: any) => {
      try {
        if (isReverse) {
          return dateU.dateKey2Time(`${m.date}-${b.t}`) - dateU.dateKey2Time(`${m.date}-${a.t}`)
        } else {
          return dateU.dateKey2Time(`${m.date}-${a.t}`) - dateU.dateKey2Time(`${m.date}-${b.t}`)
        }
      } catch (e) {
        console.error(e)
        return 0
      }
    });
  },
  // 计算月份要显示的数据
  monthCalc(m: any, isTagGroup: Boolean): any {
    this.sortMonthTagData(m)
    m.sTitle = `${dateU.dateKey2MonthNum(m.date)}月`
    m.aP = 0.0
    m.list.forEach((vv: any) => {
      m.aP += parseFloat(vv.p)
    });
    m.sP = m.budget + m.aP
    m.isProfit = m.sP >= 0
    m.sPio = util.price2IOStr(m.sP)
    let per = Math.abs(m.aP) / m.budget * 100
    if (per > 100) per = 100
    if (per < 0) per = 0
    m.per = util.price2Str(per)
    if (per >= 95) {
      m.perType = 3
    } else if (per >= 80) {
      m.perType = 2
    } else {
      m.perType = 1
    }
    if (m.isShowSub == undefined) m.isShowSub = false
    if (!isTagGroup) return m

    m.sP2 = util.price2Str(m.sP)
    let isShowSubM: any = undefined
    if (m.tags) {
      isShowSubM = {}
      m.tags.forEach((v: any) => {
        isShowSubM[v.tag] = v.isShowSub
      });
    }
    m.tags = []
    m.list.forEach((v: any, i: number) => {
      let tM = m.tags.find((item: any) => item.tag == v.tt)
      if (!tM) {
        tM = { tag: v.tt }
        m.tags.push(tM)
      }
      let tList = tM.list
      if (!tList) tList = []
      tList.push({
        t: v.t,
        p: util.pioStr2IOStr(v.p),
        i: i,
      })
      tM.list = tList
    });
    m.tags.forEach((v: any) => {
      v.aP = 0.0
      v.list.forEach((vv: any) => {
        v.aP += parseFloat(vv.p)
      });
      v.aPio = util.price2IOStr(v.aP)
      if (isShowSubM) v.isShowSub = isShowSubM[v.tag]
      if (v.isShowSub == undefined) v.isShowSub = false
    });
    return m
  },
  // 保存当月数据
  saveMonthData(m: any): string {
    if (!m || !m.date || isNaN(m.budget) || !m.list) {
      return "内容不全！"
    }
    let dateArr = m.date.split("-", 2)
    if (dateArr.length < 2) return "日期格式错误！"
    let year = dateArr[0]
    let yearList = this.year2List(year, false)
    if (!yearList) yearList = []
    let index = -1
    yearList.forEach((v, i) => {
      if (v.date == m.date) {
        index = i
        return
      }
    });
    let d = {
      date: m.date,
      budget: m.budget,
      list: m.list
    }
    if (index < 0) {
      yearList.unshift(d)
    } else {
      yearList[index] = d
    }
    return this.saveYearList(year, yearList) ? "" : "保存失败！"
  },
  // 保存年数据
  saveYearList(year: string, list: Array<any>): boolean {
    try {
      let nlist: Array<any> = []
      list.forEach(mm => {
        let mList: Array<any> = []
        if (mm.list) {
          mm.list.forEach((v: any) => {
            mList.push({ tt: v.tt, t: v.t, p: v.p })
          });
        }
        nlist.push({ date: mm.date, budget: mm.budget, list: mList })
      });
      let yListStr = JSON.stringify(nlist)
      wx.setStorageSync(conf.getYearDataKey(year), yListStr)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  },
  // 覆盖isShowSub数据
  coverIsShowSub(newL: Array<any>, oldL: Array<any>, key: string) {
    if (!newL || newL.length < 1 || !oldL || oldL.length < 1) return
    let isShowSubM: any = {}
    oldL.forEach(v => {
      isShowSubM[v[key]] = v.isShowSub
    });
    newL.forEach(v => {
      let isShowSub = isShowSubM[v[key]]
      if (isShowSub != undefined && isShowSub != null) {
        v.isShowSub = isShowSub
        v.isShowSubAnim = isShowSub
      }
    });
  },
  // 覆盖月份的isShowSub数据
  coverMonthIsShowSub(newM: any, oldM: any) {
    this.coverIsShowSub(newM.tags, oldM.tags, "tag")
  },
  // 覆盖年份的isShowSub数据
  coverYearIsShowSub(newL: Array<any>, oldL: Array<any>) {
    this.coverIsShowSub(newL, oldL, "date")
  },
}
