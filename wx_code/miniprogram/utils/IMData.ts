import util from './util.js';
import dateU from './date.js';
import verify from './verify.js';

export default {
  installmentDataKey: "installment",
  installmentDataCKey: "installmentC",
  sep: " | ",
  installment_type: "-$IM-",
  installmentC_type: "-$IMC-",

  list: <any>[],
  listC: <any>[],

  init() {
    const tList = <any>[]
    try {
      tList.push(...this.getStorageList(false))
    } catch (error) {
    }
    try {
      tList.push(...this.getStorageList(true))
    } catch (error) {
    }
    const idList = new Set()
    tList.forEach((m: any) => {
      if (idList.has(m.id)) return
      idList.add(m.id)
      if (!m) return
      if (this.isCData(m)) {
        this.listC.push(m)
      } else {
        this.list.push(m)
      }
    });
    this.saveList(false)
    this.saveList(true)

    console.log(this.list, this.listC)
    // console.log(util.roughSizeOfObject(tList)) // 1874 1628 1396
    // console.log(wx.getStorageSync(this.installmentDataKey))
    // console.log(wx.getStorageSync(this.installmentDataCKey))
  },
  // 是否是已完成数据
  isCData(m: any): boolean {
    return isNaN(m.cqs)
  },
  // 是否有已完成的分期
  isIMCList(): boolean {
    return this.listC.length > 0
  },
  // 获取本地数据
  getStorageList(isC: boolean): Array<any> {
    const list: Array<any> = []
    let sList = []
    try {
      sList = wx.getStorageSync(isC ? this.installmentDataCKey : this.installmentDataKey).split("\n")
    } catch (error) {
    }
    sList.forEach((v: any) => {
      const m = this.str2IMDataObj(v)
      if (!m) return
      list.push(m)
    });
    return list
  },
  // 字符串转分期数据
  str2IMDataObj(v: string): any {
    if (!v) return null
    try {
      const tDList = v.split(this.sep)
      if (!tDList || tDList.length < 7) return
      const m = <any>{
        id: parseInt(tDList[0]),
        tt: tDList[1],
        p: parseFloat(tDList[2]),
        qs: parseFloat(tDList[4]),
        st: tDList[5],
        st_r: tDList[6]
      }
      if (isNaN(m.id) || verify.isEmptyFun(m.tt) || isNaN(m.p) || isNaN(m.qs) ||
        isNaN(dateU.dateKey2Time(m.st)) || isNaN(dateU.dateKey2Time(m.st_r))
      ) return null
      m.type = this.str2TypeObj(tDList[3])
      if (!m.type) return null
      if (!this.dataCalc(m)) return null
      return m
    } catch (error) {
      console.error(error)
    }
    return null
  },
  // 计算一条分期数据
  dataCalc(m: any): boolean {
    delete m.cqs
    delete m.cp
    m.GI = 0
    m.list = []
    m.o = []
    const qM = this.getFQDateRange()
    m.st_rv = dateU.date2YMNum(dateU.dateKey2Date(m.st_r))
    if (qM.c < m.st_rv) {
      m.cqs = 0
      m.cp = 0
    }
    try {
      switch (m.type.t) {
        case "免息":
          this.calc_IFE(m, qM)
          break
        case "等额本息":
          this.calc_ELP(m)
          break
        case "等额本金":
          this.calc_EPP(m)
          break
        default:
          return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
    if (m.list) {
      const em = m.list[m.list.length - 1]
      if (em) m.etv = em.t
    }
    if (m.isSS == undefined || m.isSS == null) {
      m.isSS = false
      m.isSSA = false
    }
    return true
  },
  // 字符串转分期类型对象
  str2TypeObj(v: string): any {
    let m = <any>{}
    const list = v.split("_")
    if (list[0].indexOf("免息") != -1) {
      m = { t: "免息", ir: 0 }
    } else {
      return null
      // if (list.length != 2) return null
      // m = {
      //   t: list[0],
      //   ir: parseFloat(list[1])
      // }
      // if (m.t != "ELP" && m.t == "EPP") return null
      // if (isNaN(m.ir)) return null
    }
    return m
  },
  // 获取显示分期时间范围
  getFQDateRange(): any {
    const ssDate = new Date()
    dateU.monthMinus(ssDate)
    const seDate = new Date()
    dateU.monthPlus(seDate)
    return {
      s: dateU.date2YMNum(ssDate),
      c: dateU.date2YMNum(new Date()),
      e: dateU.date2YMNum(seDate),
    }
  },
  // 免息计算
  calc_IFE(m: any, qM: any) {
    const qsdrL = [qM.s, qM.c, qM.e]
    const date = dateU.dateKey2Date(m.st)
    const m_p = parseFloat(util.price2Str(m.p / m.qs))
    // console.log(m.st_rv)
    let lastQI = -1
    const dateD = date.getDate()
    for (let i = 1; i <= m.qs; i++) {
      dateU.monthPlus(date, dateD)
      // console.log(dateU.getYearMonthDayKey(date))
      const tv = dateU.date2YMNum(date)
      if (i == m.qs && i > lastQI + 1) {
        m.list.push({ isMore: true })
      }
      const mm: any = {
        p: m_p,
        t: dateU.date2YMNum(date),
      }
      m.o.push(mm)
      if (qsdrL.indexOf(tv) == -1 && i < m.qs) continue
      mm.qi = i
      m.list.push(mm)
      if (tv == qM.c) {
        m.cqs = i
        m.cp = mm.p
      }
      if (tv < m.st_rv) {
        mm.state = "dis"
      } else if (tv < qM.c) {
        mm.state = "off"
      }
      lastQI = mm.qi
    }
  },
  // 等额本息 计算
  calc_ELP(_: any) {
  },
  // 等额本金 计算
  calc_EPP(_: any) {
  },
  /**
   * 添加一条分期
   * @param m 0（添加失败）、1（添加到了list）、2（添加到了listC）
   */
  addData(m: any): number {
    m.id = new Date().getTime() - 1710992828056
    if (!this.dataCalc(m)) return 0
    const isC = this.isCData(m)
    if (isC) {
      this.listC.push(m)
    } else {
      this.list.push(m)
    }
    this.saveList(isC)
    return isC ? 2 : 1
  },
  /**
   * 删除一条分期
   * @param m @param m 0（删除失败）、1（从list删除）、2（从listC删除）
   */
  delData(m: any): number {
    return this.delDataWithIsC(m, this.isCData(m))
  },
  delDataWithIsC(m: any, isC: boolean): number {
    const list = isC ? this.listC : this.list
    const i = list.findIndex((v: any) => v.id == m.id)
    list.splice(i, 1)
    this.saveList(isC)
    return isC ? 2 : 1
  },
  /**
   * 编辑一条分期
   * @param m 0（编辑失败）、1（编辑到了list）、2（编辑到了listC）、3（两个list都改了）
   */
  editData(m: any): number {
    const isOC = this.isCData(m)
    if (!this.dataCalc(m)) return 0
    const isC = this.isCData(m)
    if (isOC == isC) {
      this.saveList(isC)
      return isC ? 2 : 1
    } else {
      this.delDataWithIsC(m, isOC)
      if (isC) {
        this.listC.push(m)
      } else {
        this.list.push(m)
      }
      this.saveList(isC)
      return 3
    }
  },
  /**
   * 排序数组
   * @param list 数组
   * @param sort 0（不排序）、1（从小到大）、2（从大到小）
   */
  sortList(list: Array<any>, sort: number) {
    list.sort((a: any, b: any) => {
      try {
        if (sort == 2) {
          return b.etv - a.etv
        } else {
          return a.etv - b.etv
        }
      } catch (e) {
        return 0
      }
    });
  },
  // 保存数组
  saveList(isC: boolean): string {
    try {
      if (isC) {
        this.sortList(this.listC, 2)
        wx.setStorageSync(this.installmentDataCKey, this.list2SaveStr(this.listC, false))
      } else {
        this.sortList(this.list, 1)
        wx.setStorageSync(this.installmentDataKey, this.list2SaveStr(this.list, false))
      }
      return ""
    } catch (error) {
      return "保存失败"
    }
  },
  // 数组转保存字符串
  list2SaveStr(list: Array<any>, isIO: boolean): string {
    let sS = ""
    list.forEach((v: any) => {
      sS += this.imData2SaveStr(v, isIO)
    });
    return sS
  },
  // 分期数据转保存字符串
  imData2SaveStr(m: any, isIO: boolean): string {
    let s = isIO ? "" : `${m.id} | `
    s += `${m.tt} | ${m.p} | ${this.imType2SaveStr(m.type)} | ${m.qs} | ${m.st} | ${m.st_r}\n`
    return s
  },
  // 分期类型转字符串
  imType2SaveStr(t: any): string {
    if (t.t == "免息") return t.t
    return `${t.t}_${t.ir}`
  },
  // 将分期数据添加到月份tag数组中
  imDataAdd2MonthData(m: any, isCurrentMonth: boolean = false) {
    const list = <any>[]
    list.push(...this.list)
    if (!isCurrentMonth) list.push(...this.listC)
    if (isCurrentMonth) {
      const dateV = dateU.date2YMNum(m.date)
      list.forEach((im: any) => {
        const imq = im.list.find((v: any) => v.t == dateV)
        const nm = {
          tt: `[${imq.qi}/${im.qs}] ${im.tt}`,
          p: 1,
          t: "04 17:24:01"
        }
        m.list.push(nm)
      });
      console.log(list.length)
    }

  },
}
