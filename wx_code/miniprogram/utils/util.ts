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

  // 获取当前日期key
  getCurrentDateKey(): string {
    return this.getYearMonthKey(new Date())
  },

  // 获取当前时间
  getCurrentDate(): string {
    return this.formatTime(new Date())
  },

  // 日期转年月key
  getYearMonthKey(date: Date): string {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    return [year, month].map(this.formatNumber).join('-')
  },

  // 日期key转月份数字
  dateKey2MonthNum(v: string): number {
    let mStr = v.split("-", 2)[1]
    if (mStr == undefined || mStr == "") mStr = "0"
    return parseInt(mStr)
  },

  // 日期key转时间戳
  dateKey2Date(v: string): Date {
    return new Date(Date.parse(v.replace(/-/g, '/')));
  },
  dateKey2Time(v: string): number {
    return this.dateKey2Date(v).getTime();
  },

  formatNumber(n: number): string {
    const s = n.toString()
    return s[1] ? s : '0' + s
  }

}
