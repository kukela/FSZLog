export default {
  monthType: <any>{
    0: 1, 1: -1, 2: 1, 3: 0, 4: 1, 5: 0, 6: 1, 7: 1, 8: 0, 9: 1, 10: 0, 11: 1
  },

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

  // 获取当前日期key
  getCurrentDateKey(): string {
    return this.getYearMonthKey(new Date())
  },

  // 获取当前年
  getCurrentYear(): string {
    return `${new Date().getFullYear()}`;
  },

  // 获取当前时间
  getCurrentDate(): string {
    return this.formatTime(new Date())
  },

  // 日期转年月key
  getYearMonthKey(date: Date): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return [year, month].map(this.formatNumber).join('-')
  },

  // 日期转年月日key
  getYearMonthDayKey(date: Date): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(this.formatNumber).join('-')
  },

  // 日期转年月数字
  date2YMNum(v: Date): number {
    return v.getFullYear() * 100 + v.getMonth() + 1
  },

  // 日期key转时间
  dateKey2Date(v: string): Date {
    return new Date(Date.parse(v.replace(/-/g, '/')));
  },
  dateKey2Time(v: string): number {
    return this.dateKey2Date(v).getTime();
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

  formatNumber(n: number): string {
    const s = n.toString()
    return s[1] ? s : '0' + s
  }

}
