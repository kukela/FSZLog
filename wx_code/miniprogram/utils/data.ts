import conf from './conf.js';
import dateU from './date.js';
import util from './util.js';
import verify from './verify.js';

export default {
  sep: " | ",

  // app打开初始化数据
  initData() {
    require('./test.js').initTestData()

    let ver = conf.getDataVer()
    if (ver < 1) {
      let state = require('./verData.js').update_0_to_1()
      if (state != "") {
        wx.showToast({
          title: `本地数据转换失败${state}，请联系管理员`, icon: 'none', duration: 5000
        })
        return
      }
    }
    conf.saveDataVer()
  },
  // 新建当月的月份数据
  newMonthData(): any {
    return {
      budget: conf.getDefBudget(),
      date: dateU.getCurrentDateKey(),
      listS: ""
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
    var list: string[] = []
    let fKey = conf.monthDataKey + year
    keys.forEach(v => {
      if (v.indexOf(fKey) == -1) return
      let m = v.replace(conf.monthDataKey, '')
      if (isNaN(dateU.dateKey2Time(m))) {
        wx.removeStorageSync(v)
        return
      }
      list.push(isMonth || sort > 0 ? m : v)
    })
    if (sort <= 0) return list
    this.sortYearData(list, 2)
    if (!isMonth) {
      list.forEach((v, i) => {
        list[i] = `${conf.monthDataKey}${v}`
      });
    }
    return list
  },
  // 获取所有年 从大到小
  getAllYears(): string[] {
    let yM = new Set<string>()
    let mList = this.getMonthDataKeys(true)
    mList.forEach(v => {
      yM.add(v.slice(0, 4))
    });
    let nL = Array.from(yM)
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
    let yKeys = this.getMonthDataKeys(false, 2, year)
    let list: any[] = []
    yKeys.forEach((k: string) => {
      list.push(this.dateKey2DataObj(k, sort))
    });
    return list
  },
  /**
   * 通过月份日期获取月份数据
   * @param date 年-月
   * @param sort 0（不排序）、1（从小到大）、2（从大到小）
   */
  date2DataObj(date: string, sort: number = 0): any {
    return this.dateKey2DataObj(`${conf.monthDataKey}${date}`, sort)
  },
  dateKey2DataObj(dateKey: string, sort: number = 0): any {
    try {
      let str = wx.getStorageSync(dateKey)
      let m = JSON.parse(str)
      m.date = dateKey.replace(conf.monthDataKey, "")
      if (m.listS) {
        let cTime = new Date().getTime();
        let nList: Array<any> = []
        m.listS.split("\n").forEach((v: string) => {
          let tag = this.tagData2Obj(v, cTime, m.date)
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
  monthCalc(m: any, sort: number = 0): any {
    if (!m) return m
    if (!m.list) m.list = []
    this.sortMonthTagData(m, sort)
    m.aP = 0.0
    m.list.forEach((v: any) => {
      m.aP += parseFloat(v.p)
    });
    m.sTitle = `${dateU.dateKey2MonthNum(m.date)}月`
    m.sP = m.budget + m.aP
    m.sP2 = util.price2Str(m.sP)
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
    m.isShowSub = false
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
    let tdList = v.split(this.sep)
    if (tdList.length < 3) return null
    let tt = tdList[0]
    let p = tdList[1]
    let t = tdList[2]
    let tDate = dateU.dateKey2Date(date ? `${date}-${t}` : t)
    let tTime = tDate.getTime()
    if (verify.vNullFun(tt) || verify.vFloatFun(p) || isNaN(tTime)) return null
    if (cTime > 0 && tTime > cTime) return null
    return { tt: tt, p: p, t: t }
  },
  // 生成月份tag数组
  genMonthTags(m: any) {
    if (!m || !m.list) return
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
    });
    // this.coverIsShowSub(m.tags, oldTags, "tag")
  },
  // 排序年内数据
  sortYearData(list: Array<any>, sort: number = 2) {
    list.sort((a: string, b: string) => {
      try {
        if (sort == 2) {
          return dateU.dateKey2Time(b) - dateU.dateKey2Time(a)
        } else {
          return dateU.dateKey2Time(a) - dateU.dateKey2Time(b)
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
