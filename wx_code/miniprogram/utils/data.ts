export default {
  ydataKey: "ydata-",
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
    if (v == undefined || v <= 0 || v == NaN || v == null) {
      v = 3000
      this.setDefBudget(v)
    }
    return v
  },
  // 设置默认预算
  setDefBudget(v: number) {
    wx.setStorageSync("defBudget", v)
  },
  // 获取当前日期key
  getCurrentDateKey(): string {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    return `${year}-${month}`
  },
  // 获取年数据key
  getYearDataKey(year: string): string {
    return `${this.ydataKey}${year}`
  },
  // 获取月数据key
  getMonthDataKey(year: string, month: string): string {
    return `${year}-${month}`
  },
  // 
  initData() {
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
  // number转+-字符串
  num2IOStr(v: number): string {
    let vs = `${v}`
    if (vs.indexOf('.') > -1) vs = v.toFixed(2)
    if (v > 0) vs = `+${vs}`
    return vs
  },
  // 年key转数组
  year2List(year: string, isCalc: boolean): any[] {
    try {
      let str = wx.getStorageSync(this.getYearDataKey(year))
      let list = JSON.parse(str)
      list = list.sort((a: any, b: any) => this.dateKey2MonthNum(b.date) - this.dateKey2MonthNum(a.date));
      if (!isCalc) return list
      list.forEach((v: any) => {
        this.monthCalc(v)
      });
      return list
    } catch (e) {
      return []
    }
  },
  // 计算月份要显示的数据
  monthCalc(m: any): any {
    let mStr = this.dateKey2MonthNum(m.date)
    m.sTitle = `${mStr}月`
    m.aP = 0.0
    m.list.forEach((vv: any) => {
      vv.aP = 0.0
      vv.list.forEach((vvv: any) => {
        vv.aP += parseFloat(vvv.p)
      });
      m.aP += vv.aP
      vv.sP = this.num2IOStr(vv.aP)
      if (vv.isShowSub == undefined) {
        vv.isShowSub = false
      }
    });
    let sp = m.budget + m.aP
    m.isProfit = sp >= 0
    m.sP = this.num2IOStr(sp)
    m.sP2 = m.sP.replace("+", '')
    let per = Math.abs(m.aP) / m.budget * 100
    if (per > 100) per = 100
    m.per = per.toFixed(2)
    if (per >= 95) {
      m.perType = 3
    } else if (per >= 80) {
      m.perType = 2
    } else {
      m.perType = 1
    }
    if (m.isShowSub == undefined) {
      m.isShowSub = false
    }
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
      return this.monthCalc(m)
    }
    return null
  },
  // 新建当月的月份数据
  newMonthData(): any {
    let nm = {
      "date": this.getCurrentDateKey(),
      "budget": this.getDefBudget(),
      "list": []
    }
    return this.monthCalc(nm)
  },
  // 日期key转月份数字
  dateKey2MonthNum(v: string): number {
    let mStr = v.split("-", 2)[1]
    if (mStr == undefined || mStr == "") mStr = "0"
    return parseInt(mStr)
  },
  // 获取所有tag数组
  getAddTagList(): string[] {
    let tagList: string[] = []
    let list = this.getYearDataKeys(true)
    list.sort((a: any, b: any) => parseInt(b) - parseInt(a));
    list.forEach((year: string) => {
      let mList = this.year2List(year, false)
      mList.forEach((m: any) => {
        m.list.forEach((t: any) => {
          if (tagList.indexOf(t.name) == -1) {
            tagList.push(t.name)
          }
        });
      });
    });
    return tagList
  },
  // +-字符串转obj
  pioStr2Obj(v: string): any {
    let sL = v.substr(0, 1)
    let pio = "in"
    if (sL == "-") {
      pio = "out"
    }
    return {
      pio: pio,
      p: v.substring(1)
    }
  }

}
