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
  // 是否有已完成的分期
  isIMCList: false,

  init() {
    this.listC = []
    this.list = this.str2List(this.installmentDataKey, true)
    if (this.listC.length > 0) {
      this.sortList(this.list, 1)
      this.saveList(false)
      const listC = this.str2List(this.installmentDataCKey, false)
      this.listC.concat(listC)
      this.sortList(this.listC, 2)
      this.saveList(true)
      this.listC = []
    }
    const imC = wx.getStorageSync(this.installmentDataCKey)
    this.isIMCList = imC != undefined && imC.length > 2

    console.log(this.list, this.listC)
    // console.log(wx.getStorageSync(this.installmentDataKey))
    // console.log(wx.getStorageSync(this.installmentDataCKey))
  },
  initCList() {
    this.listC = this.str2List(this.installmentDataCKey, false)
    this.isIMCList = this.listC.length > 0
  },
  // 字符串key转数组
  str2List(key: string, isAddListC: boolean): Array<any> {
    const list: Array<any> = []
    const imStr = wx.getStorageSync(key)
    let imStrList = []
    try {
      imStrList = imStr.split("\n")
    } catch (error) {
    }
    imStrList.forEach((v: any) => {
      const m = this.str2IMDataObj(v)
      if (!m) return
      if (isAddListC && !m.cqs) {
        this.listC.push(m)
      } else {
        list.push(m)
      }
    });
    return list
  },
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

      m.pS = util.price2Str(m.p)
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
        }
      } catch (error) {
        return null
      }
      if (m.list) {
        let em = m.list[m.list.length - 1]
        if (em) m.etv = parseInt(em.t.replace("-", ''))
      }
      m.isShowSub = false
      return m
    } catch (error) {
      console.error(error)
    }
    return null
  },
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
    ssDate.setMonth(ssDate.getMonth() - 1)
    const seDate = new Date()
    seDate.setMonth(seDate.getMonth() + 1)
    return {
      s: dateU.date2YMNum(ssDate),
      c: dateU.date2YMNum(new Date()),
      e: dateU.date2YMNum(seDate),
    }
  },
  // 免息计算
  calc_IFE(m: any) {
    m.GI = 0
    m.list = []
    const qM = this.getFQDateRange()
    // console.log(qM)
    const qsdrL = [qM.s, qM.c, qM.e]
    const date = dateU.dateKey2Date(m.st)
    const m_pS = util.price2Str(m.p / m.qs)
    const m_p = parseFloat(m_pS)
    const st_r_v = dateU.date2YMNum(dateU.dateKey2Date(m.st_r))
    // console.log(st_r_v)
    let lastQI = -1
    for (let i = 1; i <= m.qs; i++) {
      date.setMonth(date.getMonth() + 1)
      const tv = dateU.date2YMNum(date)
      // console.log(t)
      if (i == m.qs && i > lastQI + 1) {
        m.list.push({ isMore: true })
      }
      if (qsdrL.indexOf(tv) == -1 && i < m.qs) continue
      const mm: any = {
        p: m_p,
        pS: m_pS,
        t: dateU.getYearMonthKey(date),
      }
      m.list.push(mm)
      if (tv == qM.c) {
        m.cqs = i
        m.cpS = mm.pS
      }
      mm.qi = i
      if (tv < st_r_v) {
        mm.state = "dis"
      } else if (tv < qM.c) {
        mm.state = "off"
      }
      lastQI = mm.qi
    }
  },
  // 等额本息 计算
  calc_ELP(m: any) {
  },
  // 等额本金 计算
  calc_EPP(m: any) {
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
      if (!isC) {
        wx.setStorageSync(this.installmentDataKey, this.list2SaveStr(this.list, false))
      } else {
        wx.setStorageSync(this.installmentDataCKey, this.list2SaveStr(this.listC, false))
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
  }
}
