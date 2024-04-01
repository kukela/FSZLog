import conf from './conf.js';
import dateU from './date.js';
import verify from './verify.js';
import IMData from './IMData.js'
import anim from './anim.js';

export default {
  sep: " | ",

  // app打开初始化数据
  initData() {
    if (conf.env != 0) require('./test.js').initTestData()

    const ver = conf.getDataVer()
    if (ver < 1) {
      const state = require('./verData.js').update_0_to_1()
      if (state != "") {
        wx.showToast({
          title: `本地数据转换失败${state}，请联系管理员`, icon: 'none', duration: 5000
        })
        return
      }
    }
    if (ver < 2) {
      wx.removeStorageSync("installment")
    }
    conf.saveDataVer()

    IMData.init()
  },
  // 新建当月的月份数据
  newMonthData(): any {
    const nm = {
      budget: conf.getDefBudget(),
      date: dateU.getCurrentDateKey(),
      listS: ""
    }
    this.monthCalc(nm, 2)
    return nm
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
    const fKey = conf.monthDataKey + year
    keys.forEach(v => {
      if (v.indexOf(fKey) == -1) return
      const m = v.replace(conf.monthDataKey, '')
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
    const yM = new Set<string>()
    const mList = this.getMonthDataKeys(true)
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
    const list: any[] = []
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
      const str = wx.getStorageSync(dateKey)
      if(!str) return null
      const m = JSON.parse(str)
      m.date = dateKey.replace(conf.monthDataKey, "")
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
       // 添加分期数据
       IMData.imDataAdd2MonthData(m, dateU.getCurrentDateKey() == m.date)
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
    const tDate = dateU.dateKey2Date(date ? `${date}-${t}` : t)
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
        if(v.isNS) tM.isNS = true
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
  // 覆盖年份的isShowSub数据
  coverYearIsShowSub(newL: Array<any>, oldL: Array<any>) {
    anim.coverIsShowSub(newL, oldL, "date")
  },
}
