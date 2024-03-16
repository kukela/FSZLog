import conf from './conf.js';
import util from './util.js';
import dateU from './date.js';
import verify from './verify.js';

export default {
  installmentDataKey: "installment",
  installmentDataCKey: "installmentC",
  sep: " | ",
  installment_type: "-$IM-",
  installmentC_type: "-$IMC-",
  typeM: <any>{
    "IFE": "免息",
    "ELP": "等额本息",
    "EPP": "等额本金",
  },

  list: <any>[],
  listC: <any>[],

  init() {
    this.list = this.str2List(this.installmentDataKey)
    // this.listC = this.str2List(this.installmentDataCKey)
  },
  // 字符串key转数组
  str2List(key: string): Array<any> {
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
      list.push(m)
    });
    console.log(list)
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
      if (isNaN(m.id) || verify.vNullFun(m.tt) || isNaN(m.p) || isNaN(m.qs) ||
        isNaN(dateU.dateKey2Time(m.st)) || isNaN(dateU.dateKey2Time(m.st_r))
      ) return null
      m.type = this.str2TypeObj(tDList[3])
      if (!m.type) return null

      m.pS = util.price2Str(m.p)
      try {
        switch (m.type.t) {
          case "IFE":
            this.calc_IFE(m)
            break
          case "ELP":
            this.calc_ELP(m)
            break
          case "EPP":
            this.calc_EPP(m)
            break
        }
      } catch (error) {
        return null
      }
      return m
    } catch (error) {
    }
    return null
  },
  str2TypeObj(v: string): any {
    let m = <any>{}
    const list = v.split("_")
    if (list[0].indexOf("IFE") != -1) {
      m = { t: "IFE", ir: 0 }
    } else {
      if (list.length != 2) return null
      m = {
        t: list[0],
        ir: parseFloat(list[1])
      }
      if (m.t != "ELP" && m.t == "EPP") return null
      if (isNaN(m.ir)) return null
    }
    m.tt = this.typeM[m.t]
    return m
  },
  // 获取显示分期时间范围
  getQSDateRange(qs: number): any {
    const scDate = new Date()
    const ssDate = new Date()
    ssDate.setMonth(ssDate.getMonth() - 1)
    const seDate = new Date()
    seDate.setMonth(seDate.getMonth() + 2)
    const eDate = new Date()
    eDate.setMonth(eDate.getMonth() + qs)
    return {
      s_c: dateU.getYearMonthKey(scDate),
      s_s: dateU.getYearMonthKey(ssDate),
      s_e: dateU.getYearMonthKey(seDate),
      e: dateU.getYearMonthKey(eDate)
    }
  },
  // 免息计算
  calc_IFE(m: any) {
    m.GI = 0
    m.list = []
    let qsdrM = this.getQSDateRange(m.qs)
    console.log(qsdrM)
    const date = dateU.dateKey2Date(m.st)
    for (let i = 0; i < m.qs; i++) {
      let t = dateU.getYearMonthKey(date)
      // m.list.push({t: t})

      date.setMonth(date.getMonth() + 1)
    }
    // m.p
  },
  // 等额本息 计算
  calc_ELP(m: any) {
  },
  // 等额本金 计算
  calc_EPP(m: any) {
  },

}
