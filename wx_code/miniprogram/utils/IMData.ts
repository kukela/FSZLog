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

  imRefList: <any>[],

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
      if (!tDList || tDList.length < 2) return null
      const td0 = tDList[0]
      if (tDList.length < 7) return null
      const m = <any>{
        id: parseInt(td0),
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
      if (tDList.length > 7) {
        const tq = this.str2TQObj(tDList[7])
        if (tq) m.tq = tq
      }
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
      let eTi = m.o.findIndex((v: any) => v.p <= 0)
      eTi = eTi > 0 ? eTi - 1 : m.o.length - 1
      let eT = m.o[eTi]
      if (eT) m.etv = eT.t
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
  // 字符串转提前还款数组
  str2TQObj(v: string): any {
    const tqList = v.split(',')
    const list = <any>[]
    tqList.forEach((s: string) => {
      const vList = s.split('_')
      if (!vList || vList.length < 3) return
      const m = {
        t: parseInt(vList[0]),
        p: parseFloat(vList[1]),
        m_t: parseInt(vList[2]),
      }
      if (isNaN(m.t) || isNaN(m.p) || isNaN(m.m_t)) return
      list.push(m)
    });
    list.sort((a: any, b: any) => {
      return a.t - b.t
    });
    return list
  },
  // 获取显示分期时间范围
  getFQDateRange(): any {
    return {
      s: dateU.date2YMNum(dateU.monthMinus(new Date())),
      c: dateU.date2YMNum(new Date()),
      e: dateU.date2YMNum(dateU.monthPlus(new Date())),
    }
  },
  // 获取提前还款
  getTQData(tq: Array<any>, t: number): any {
    if (!tq) return null
    const tqm = tq.find((v: any) => v.t == t)
    if (!tqm || isNaN(tqm.p)) return null
    return tqm
  },
  // 免息计算
  calc_IFE(m: any) {
    let ap = m.p
    let m_p = 0
    let calcMP = (qs: number) => {
      m_p = this.num2P(ap / qs)
    }
    calcMP(m.qs)
    if (isNaN(m_p)) return
    const lastI = m.o.length - 1
    m.o.forEach((mm: any, i: number) => {
      if (i != lastI && ap > 0) {
        const tqm = this.getTQData(m.tq, mm.t)
        if (tqm && tqm.p > m_p) {
          mm.p = tqm.p
          ap -= mm.p
          calcMP(m.qs - i - 1)
        } else {
          mm.p = m_p
          ap -= mm.p
        }
      } else {
        mm.p = this.num2P(ap)
        ap = 0
      }
    });
  },
  // 等额本息 计算
  calc_ELP(m: any) {
    const irv = this.getImIrValue(m.type)
    let ap = m.p
    let m_p = 0
    let calcMP = (qs: number) => {
      const amirv = Math.pow(1 + irv, qs)
      m_p = (ap * irv * amirv) / (amirv - 1)
    }
    calcMP(m.qs)
    if (isNaN(m_p)) return
    let gi = 0
    const lastI = m.o.length - 1
    m.o.forEach((mm: any, i: number) => {
      mm.ir = this.num2P(ap * irv)
      if (i != lastI && ap > 0) {
        const tqm = this.getTQData(m.tq, mm.t)
        if (tqm && tqm.p > m_p) {
          mm.p = tqm.p - mm.ir
          ap -= mm.p
          calcMP(m.qs - i - 1)
        } else {
          mm.p = this.num2P(m_p - mm.ir)
          ap -= mm.p
        }
      } else {
        mm.p = this.num2P(ap)
        ap = 0
      }
      gi += mm.ir
    });
    m.GI = this.num2P(gi)
  },
  // 等额本金 计算
  calc_EPP(m: any) {
    const irv = this.getImIrValue(m.type)
    let ap = m.p
    let m_p = 0
    let calcMP = (qs: number) => {
      m_p = this.num2P(ap / qs)
    }
    calcMP(m.qs)
    if (isNaN(m_p)) return
    let gi = 0
    const lastI = m.o.length - 1
    m.o.forEach((mm: any, i: number) => {
      mm.ir = this.num2P(ap * irv)
      if (i != lastI && ap > 0) {
        const tqm = this.getTQData(m.tq, mm.t)
        if (tqm && tqm.p > m_p) {
          mm.p = tqm.p - mm.ir
          ap -= mm.p
          calcMP(m.qs - i - 1)
        } else {
          mm.p = m_p
          ap -= mm.p
        }
      } else {
        mm.p = this.num2P(ap)
        ap = 0
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
        m.cp = v.ir ? v.p + v.ir : v.p
        if (m.cp > 0) m.cqs = qi
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
  delDataWithId(id: number): number {
    // return this.delDataWithIsC(m, this.isCData(m))
    let i = this.list.findIndex((v: any) => v.id == id)
    if (i >= 0) {
      this.list.splice(i, 1)
      this.saveList(false)
      return 1
    }
    i = this.listC.findIndex((v: any) => v.id == id)
    if (i >= 0) {
      this.listC.splice(i, 1)
      this.saveList(true)
      return 2
    }
    return 0
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
      this.delDataWithId(m.id)
      if (isC) {
        this.listC.push(m)
      } else {
        this.list.push(m)
      }
      this.saveList(isC)
      return [1, 2]
    }
  },
  editDataU(m: any, succ: any = null): Array<number> {
    const editTL = this.editData(m)
    // console.log(nm)
    if (editTL.length <= 0) {
      wx.showToast({ title: '编辑失败！', icon: 'error', duration: 2000 })
      return []
    }
    if (editTL[0] == 3) {
      const self = this
      this.imArcDataU(m, () => {
        self.delDataWithId(m.id)
        succ && succ(editTL)
      })
      return []
    }
    succ && succ(editTL)
    return editTL
  },
  // 将数据归档到历史列表
  imArcDataU(m: any, succ: any = null) {
    const self = this
    wx.showModal({
      title: '提示', content: '当前数据已完成超过90天，点击确定会归档到历史数据中！',
      success(res) {
        if (!res.confirm) return
        if (!self.arcData(m)) {
          wx.showToast({ title: '归档失败！', icon: 'error', duration: 2000 })
          return
        }
        succ && succ()
      }
    })
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
        wx.setStorageSync(this.installmentDataCKey, this.list2SaveStr(this.listC))
      } else {
        this.sortList(this.list, 1)
        wx.setStorageSync(this.installmentDataKey, this.list2SaveStr(this.list))
      }
      return ""
    } catch (error) {
      return "保存失败"
    }
  },
  // 数组转保存字符串
  list2SaveStr(list: Array<any>, sep: String = ""): string {
    let str = ""
    if (!sep) sep = this.sep
    list.forEach((v: any) => {
      let type = this.imType2SaveStr(v.type)
      if (!type) return
      str += `${v.id}${sep}${v.tt}${sep}${v.p}${sep}${type}${sep}${v.qs}${sep}${v.st}${sep}${v.st_r}`
      if (v.tq) {
        str += `${sep}${this.imTQ2SaveStr(v.tq)}\n`
      } else {
        str += "\n"
      }
    });
    return str
  },
  // 分期类型转字符串
  imType2SaveStr(t: any): string {
    if (t.t == "免息") return t.t
    return `${t.t}_${t.ir}`
  },
  // 提前还款数据转字符串
  imTQ2SaveStr(tq: Array<any>): string {
    let s = ""
    tq.forEach((v: any) => {
      s += `${v.t}_${v.p}_${v.m_t},`
    });
    return s
  },
  // 将分期数据添加到月份tag数组中
  imDataAdd2MonthData(m: any, isCurrentMonth: boolean = false) {
    const list = <any>[]
    list.push(...this.list)
    if (!isCurrentMonth) list.push(...this.listC)
    const dateV = dateU.date2YMNum(dateU.dateKey2Date(m.date))
    list.forEach((im: any) => {
      if(dateV < im.st_rv) return
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
