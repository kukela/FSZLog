import util from './util.js';
import verify from './verify.js';

export default {
  ydataKey: "ydata-",
  ioSepStr: " | ",
  io_budget_type: "-$budget-",
  // app打开初始化数据
  initData() {
    // require('./test.js').initTestData()
  },
  // 获取当前年
  getCurrentYear(): string {
    return `${new Date().getFullYear()}`;
  },
  // 获取历史页面年
  getDefYear(): string {
    var defYear = wx.getStorageSync("defYear")
    if (defYear == undefined || defYear.length == 0) {
      return this.getCurrentYear()
    }
    return defYear
  },
  // 设置历史页面年
  setDefYear(v: string) {
    wx.setStorageSync("defYear", v)
  },
  // 设置默认预算
  getDefBudget(): number {
    let v = wx.getStorageSync("defBudget")
    if (v == undefined || v <= 0 || isNaN(v) || v == null) {
      v = 3000
      this.setDefBudget(v)
    }
    return v
  },
  setDefBudget(v: number) {
    wx.setStorageSync("defBudget", v)
  },
  // 获取年数据key
  getYearDataKey(year: string): string {
    return `${this.ydataKey}${year}`
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
        if (v.indexOf(this.ydataKey) !== -1) {
          if (isYear) {
            rList.push(v.replace(this.ydataKey, ''))
          } else {
            rList.push(v)
          }
        }
      })
      return rList
    } catch (e) {
      return []
    }
  },
  // 价格转字符串
  price2Str(v: number, _: string = "￥"): string {
    return v % 1 === 0 ? `${v}` : v.toFixed(2)
  },
  // 价格转+-字符串
  price2IOStr(v: number, type: string = "￥"): string {
    let vs = `${v}`
    if (vs.indexOf('.') > -1) vs = this.price2Str(v, type)
    if (v > 0) vs = `+${vs}`
    return vs
  },
  //价格字符串转+-字符串
  pioStr2IOStr(v: string, type: string = "￥"): string {
    return this.price2IOStr(parseFloat(v), type)
  },
  // 年key转数组
  year2List(year: string, isCalc: boolean): any[] {
    try {
      let str = wx.getStorageSync(this.getYearDataKey(year))
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
  sortMonthData(list: Array<any>, isReverse: boolean = true): Array<any> {
    return list.sort((a: any, b: any) => {
      try {
        if (isReverse) {
          return util.dateKey2MonthNum(b.date) - util.dateKey2MonthNum(a.date)
        } else {
          return util.dateKey2MonthNum(a.date) - util.dateKey2MonthNum(b.date)
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
          return util.dateKey2Time(`${m.date}-${b.t}`) - util.dateKey2Time(`${m.date}-${a.t}`)
        } else {
          return util.dateKey2Time(`${m.date}-${a.t}`) - util.dateKey2Time(`${m.date}-${b.t}`)
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
    m.sTitle = `${util.dateKey2MonthNum(m.date)}月`
    m.aP = 0.0
    m.list.forEach((vv: any) => {
      m.aP += parseFloat(vv.p)
    });
    m.sP = m.budget + m.aP
    m.isProfit = m.sP >= 0
    m.sPio = this.price2IOStr(m.sP)
    let per = Math.abs(m.aP) / m.budget * 100
    if (per > 100) per = 100
    if (per < 0) per = 0
    m.per = this.price2Str(per)
    if (per >= 95) {
      m.perType = 3
    } else if (per >= 80) {
      m.perType = 2
    } else {
      m.perType = 1
    }
    if (m.isShowSub == undefined) m.isShowSub = false
    if (!isTagGroup) return m

    m.sP2 = this.price2Str(m.sP)
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
        p: this.pioStr2IOStr(v.p),
        i: i,
      })
      tM.list = tList
    });
    console.log(m.tags)
    m.tags.forEach((v: any) => {
      v.aP = 0.0
      v.list.forEach((vv: any) => {
        v.aP += parseFloat(vv.p)
      });
      v.aPio = this.price2IOStr(v.aP)
      if (isShowSubM) v.isShowSub = isShowSubM[v.tag]
      if (v.isShowSub == undefined) v.isShowSub = false
    });
    return m
  },
  // 获取月份数据
  month2DataObj(yearList: any[], date: string): any {
    for (let key in yearList) {
      let m = yearList[key]
      if (m.date == date) return m
    }
    return null
  },
  // 通过日期获取数据
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
  // 新建当月的月份数据
  newMonthData(): any {
    let nm = {
      "date": util.getCurrentDateKey(),
      "budget": this.getDefBudget(),
      "list": []
    }
    return this.monthCalc(nm, true)
  },
  // 获取所有tag数组
  getAddTagList(): string[] {
    let tagList: string[] = []
    let list = this.getYearDataKeys(true)
    list.sort((a: any, b: any) => parseInt(b) - parseInt(a));
    list.forEach((year: string) => {
      let mList = this.year2List(year, false)
      mList.forEach((m: any) => {
        this.sortMonthTagData(m)
        m.list.forEach((t: any) => {
          if (!t.tt) return
          if (tagList.indexOf(t.tt) == -1) {
            tagList.push(t.tt)
          }
        });
      });
    });
    return tagList
  },
  // +-字符串转obj
  pioStr2Obj(v: string): any {
    let sL = v.substr(0, 1)
    let vv = v.substring(1)
    let pio = ""
    if (sL == "-") {
      pio = "out"
    } else if (sL == "+") {
      pio = "in"
    } else {
      vv = v
    }
    return {
      pio: pio,
      p: vv
    }
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
      wx.setStorageSync(this.getYearDataKey(year), yListStr)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  },
  // 覆盖月份的isShowSub数据
  coverMonthIsShowSub(newM: any, oldM: any) {
    if (!oldM || !oldM.tags || !newM || !newM.tags) return
    let isShowSubM: any = {}
    oldM.tags.forEach((v: any) => {
      isShowSubM[v.tag] = v.isShowSub
    });
    newM.tags.forEach((v: any) => {
      v.isShowSub = isShowSubM[v.tag]
    });
  },
  // 覆盖年份的isShowSub数据
  coverYearIsShowSub(newL: Array<any>, oldL: Array<any>) {
    if (!newL || newL.length < 1 || !oldL || oldL.length < 1) return
    let isShowSubM: any = {}
    oldL.forEach(v => {
      isShowSubM[v.date] = v.isShowSub
    });
    newL.forEach(v => {
      let isShowSub = isShowSubM[v.date]
      if (isShowSub != undefined && isShowSub != null) {
        v.isShowSub = isShowSub
      }
    });
  },
  // 年数组数据转格式字符串
  yearList2CopyStr(list: Array<any>): string {
    let nList = JSON.parse(JSON.stringify(list))
    let str = ""
    let ioSepStr = this.ioSepStr
    nList = this.sortMonthData(nList, false)
    nList.forEach((v: any) => {
      str += `${this.io_budget_type}${ioSepStr}${v.budget}${ioSepStr}${v.date}\n`
      this.sortMonthTagData(v, false)
      v.list.forEach((vv: any) => {
        str += `${vv.tt}${ioSepStr}${vv.p}${ioSepStr}${v.date}-${vv.t}\n`
      });
    });
    return str
  },
  // 导入年数据字符串
  importYearListStr(str: String): Array<any> {
    let list: Array<any> = []
    let cTime = new Date().getTime();
    str.split("\n").forEach(v => {
      let tDList = v.split(this.ioSepStr)
      if (tDList.length < 3) return
      let tt = tDList[0]
      let p = tDList[1]
      let t = tDList[2]
      let tDate = util.dateKey2Date(t)
      let tTime = tDate.getTime()
      if (verify.vNullFun(tt) || verify.vFloatFun(p) || isNaN(tTime)) return
      if (tTime > cTime) return
      let tag = { tt: tt, p: p, t: "" }
      if (tt == this.io_budget_type) {
        tag.t = util.getYearMonthKey(tDate)
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
      if (v.tt == this.io_budget_type) {
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
      let list = this.year2List(year, false)
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
      if (!this.saveYearList(year, list)) {
        isAllOk = false
      }
    });
    return isAllOk ? "" : "部分数据错误"
  }
}
