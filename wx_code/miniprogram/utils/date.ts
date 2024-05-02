export default {

  formatTime(date: Date): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return (
      [year, month, day].map(this.formatNumber).join('-') +
      ' ' +
      [hour, minute, second].map(this.formatNumber).join(':')
    )
  },

  // 获取当前年
  getCurrentYear(): string {
    return `${new Date().getFullYear()}`;
  },

  // 获取当前时间
  getCurrentDate(): string {
    return this.formatTime(new Date())
  },

  // 获取当前年月
  getCurrentYearMonth(): string {
    return this.getYearMonth(new Date())
  },

  // 日期转年月
  getYearMonth(date: Date): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return [year, month].map(this.formatNumber).join('-')
  },

  // 日期转年月日
  getYearMonthDay(date: Date): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(this.formatNumber).join('-')
  },

  // 日期转年月数字
  date2YMNum(v: Date): number {
    return v.getFullYear() * 100 + v.getMonth() + 1
  },

  // 年月数字转日期
  YMNum2date(v: number): string {
    const arr = ("" + v).split('')
    if (arr.length >= 6) arr.splice(4, 0, "-")
    return arr.join('')
  },

  YMNum2DateTitle(v: number): string {
    const m = v % 100
    const y = parseInt("" + (v / 100))
    return `${y}年${m}月`
  },

  // 日期字符串转时间
  str2Date(v: string): Date {
    let tt = v.replace(/-/g, '/')
    if (tt.length <= 7) tt += "/01"
    return new Date(Date.parse(tt));
  },
  str2Time(v: string): number {
    return this.str2Date(v).getTime();
  },

  // 设置月份，防止最后一天溢出
  setMonthV(v: Date, m: number, date: number = -1): Date {
    v.setMonth(m)
    if (date > 0) v.setDate(date)
    if (m != 12 && v.getMonth() != m) v.setDate(0)
    return v
  },

  // 日期月份+1
  monthPlus(v: Date, date: number = -1): Date {
    this.setMonthV(v, v.getMonth() + 1, date)
    return v
  },

  // 日期月份-1
  monthMinus(v: Date, date: number = -1): Date {
    this.setMonthV(v, v.getMonth() - 1, date)
    return v
  },

  // 计算两个日期相差天数
  getDaysBetween(startDate: Date, enDate: Date): number {
    const sDate = startDate.getTime()
    const eDate = enDate.getTime()
    return (eDate - sDate) / (1 * 24 * 60 * 60 * 1000)
  },

  formatNumber(n: number): string {
    const s = n.toString()
    return s[1] ? s : '0' + s
  }

}
