import util from './util.js';
import dateU from './date.js';
import verify from './verify.js';
import data from './data.js';
import IOData from './IOData.js';

export default {
  installmentDataKey: "installment",
  installmentDataCKey: "installmentC",
  sep: " | ",

  list: <any>[],
  listC: <any>[],

  init(tList: any = null) {
    if (tList) {
      this.list = []
      this.listC = []
    } else {
      tList = <any>[]
      try {
        tList.push(...this.getStorageList(false))
      } catch (error) {
      }
      try {
        tList.push(...this.getStorageList(true))
      } catch (error) {
      }
    }
    const idList = new Set()
    tList.forEach((m: any) => {
      if (idList.has(m.id)) return
      idList.add(m.id)
      if (!m) return
      if (m.isArc && this.arcData(m)) return
      if (this.isCData(m)) {
        this.listC.push(m)
      } else {
        this.list.push(m)
      }
    });
    this.saveList(false)
    this.saveList(true)

    // console.log(this.list, this.listC)
    // console.log(util.roughSizeOfObject(tList)) // 1874 1628 1396
    // console.log(wx.getStorageSync(this.installmentDataKey))
    // console.log(wx.getStorageSync(this.installmentDataCKey))
  },
  // 归档分期数据
  arcData(m: any): boolean {
    let isAllOk = true
    m.o.forEach((v: any, i: number) => {
      const md = data.date2DataObj(dateU.dateNum2Key(v.t), 0)
      if (!md) return
      const nm = this.imData2MonthData(m, i)
      if (!nm) return
      md.list.push(nm)
      if (IOData.saveMonthData(md)) {
        isAllOk = false
      }
    });
    return isAllOk
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
  str2IMDataObj(v: string, isCalc: boolean = true): any {
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
      if (isCalc && !this.dataCalc(m)) return null
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
    const stD = dateU.dateKey2Date(m.st)
    const stDD = stD.getDate()
    for (let i = 0; i < m.qs; i++) {
      dateU.monthPlus(stD, stDD)
      m.o.push({ t: dateU.date2YMNum(stD) })
    }
    try {
      switch (m.type.t) {
        case "免息":
          this.calc_IFE(m)
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
    if (m.o) {
      const fT = m.o[0].t
      const eT = m.o[m.o.length - 1].t
      const qM = this.getFQDateRange()
      m.st_rv = dateU.date2YMNum(dateU.dateKey2Date(m.st_r))
      if (m.st_rv < fT) {
        m.st_r = dateU.dateNum2Key(fT)
        m.st_rv = fT
      }
      if (qM.c < fT) {
        m.cqs = 0
        m.cp = 0
      }
      if (eT) m.etv = eT
      this.genThumList(m, qM)
    }
    if (this.isCData(m)) {
      const et = `${dateU.dateNum2Key(m.etv)}-${m.st.slice(-2)}`
      m.isArc = dateU.getDaysBetween(dateU.dateKey2Date(et), new Date()) > 90
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
      if (list.length != 2) return null
      m = {
        t: list[0],
        ir: parseFloat(list[1])
      }
      if (m.t != "等额本息" && m.t != "等额本金") return null
      if (isNaN(m.ir)) return null
    }
    return m
  },
  // 获取显示分期时间范围
  getFQDateRange(): any {
    return {
      s: dateU.date2YMNum(dateU.monthMinus(new Date())),
      c: dateU.date2YMNum(new Date()),
      e: dateU.date2YMNum(dateU.monthPlus(new Date())),
    }
  },
  // 免息计算
  calc_IFE(m: any) {
    let ap = m.p
    const m_p = this.num2P(m.p / m.qs)
    const lastI = m.o.length - 1
    m.o.forEach((mm: any, i: number) => {
      if (i != lastI) {
        mm.p = m_p
        ap -= mm.p
      } else {
        mm.p = this.num2P(ap)
      }
    });
  },
  // 等额本息 计算
  calc_ELP(m: any) {
    const irv = this.getImIrValue(m.type)
    let ap = m.p
    const amirv = Math.pow(1 + irv, m.qs)
    const m_p = (ap * irv * amirv) / (amirv - 1)
    if (isNaN(m_p)) return
    let gi = 0
    const lastI = m.o.length - 1
    m.o.forEach((mm: any, i: number) => {
      mm.ir = this.num2P(ap * irv)
      if (i != lastI) {
        mm.p = this.num2P(m_p - mm.ir)
        ap -= mm.p
      } else {
        mm.p = this.num2P(ap)
      }
      gi += mm.ir
    });
    m.GI = this.num2P(gi)
  },
  // 等额本金 计算
  calc_EPP(m: any) {
    const irv = this.getImIrValue(m.type)
    let ap = m.p
    const m_p = this.num2P(m.p / m.qs)
    let gi = 0
    const lastI = m.o.length - 1
    m.o.forEach((mm: any, i: number) => {
      mm.ir = this.num2P(ap * irv)
      if (i != lastI) {
        mm.p = m_p
        ap -= mm.p
      } else {
        mm.p = this.num2P(ap)
      }
      gi += mm.ir
    });
    m.GI = this.num2P(gi)
  },
  // 数字转价格数字
  num2P(v: number): number {
    return parseFloat(util.price2Str(v))
  },
  // 获取利息值
  getImIrValue(type: any): number {
    if (!type.ir) return 0
    return type.ir / 100 / 12
  },
  // 生成缩略列表
  genThumList(m: any, qM: any) {
    let lastQI = -1
    const qsdrL = [qM.s, qM.c, qM.e]
    m.o.forEach((v: any, i: number) => {
      const qi = i + 1
      if (qi == m.qs && qi > lastQI + 1) {
        m.list.push({ isMore: true })
      }
      if (qsdrL.indexOf(v.t) == -1 && qi < m.qs) return
      v.qi = qi
      m.list.push(v)
      if (v.t == qM.c) {
        m.cqs = qi
        m.cp = v.ir ? v.p + v.ir : v.p
      }
      if (v.t < m.st_rv) {
        v.state = "dis"
      } else if (v.t < qM.c) {
        v.state = "off"
      }
      lastQI = v.qi
    });
  },
  /**
   * 添加一条分期
   * @param m 0（添加失败）、1（添加到了list）、2（添加到了listC）、3（归档数据）
   */
  addData(m: any): number {
    this.genDataId(m)
    if (!this.dataCalc(m)) return 0
    const isC = this.isCData(m)
    if (isC) {
      if (m.isArc) return 3
      this.listC.push(m)
    } else {
      this.list.push(m)
    }
    this.saveList(isC)
    return isC ? 2 : 1
  },
  genDataId(m: any) {
    m.id = new Date().getTime() - 1710992828056
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
   * @param m 空数组（编辑失败）、1（编辑到了list）、2（编辑到了listC）、3（归档数据）
   */
  editData(m: any): Array<number> {
    const isOC = this.isCData(m)
    if (!this.dataCalc(m)) return []
    const isC = this.isCData(m)
    if (isC && m.isArc) {
      return isOC ? [3, 2] : [3, 1]
    }
    if (isOC == isC) {
      this.saveList(isC)
      return isC ? [2] : [1]
    } else {
      this.delDataWithIsC(m, isOC)
      if (isC) {
        this.listC.push(m)
      } else {
        this.list.push(m)
      }
      this.saveList(isC)
      return [1, 2]
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
    const dateV = dateU.date2YMNum(dateU.dateKey2Date(m.date))
    list.forEach((im: any) => {
      const imqI = im.o.findIndex((v: any) => v.t == dateV)
      if (imqI < 0) return
      const nm = this.imData2MonthData(im, imqI)
      nm.isNS = true
      if (!nm) return
      m.list.push(nm)
    });
  },
  // 分期数据转月份tag数据
  imData2MonthData(m: any, index: number): any {
    try {
      const mm = m.o[index]
      const nm = {
        tt: `[${index + 1}/${m.qs}] ${m.tt}`,
        p: -(mm.ir ? mm.ir + mm.p : mm.p),
        t: `${m.st.slice(-2)} 00:00:01`
      }
      return nm
    } catch (error) {
      return null
    }
  },
  // 通过id获取分期数据
  id2ImData(id: any): any {
    const idv = parseInt(id)
    if (isNaN(idv)) return null
    let tM = this.list.find((item: any) => item.id == idv)
    if (tM) return tM
    tM = this.listC.find((item: any) => item.id == idv)
    return tM
  },
}
