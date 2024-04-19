import dateU from './date.js';
import S from './storage.js';

export default {
  // 0 正式环境
  env: 0,
  // 当前数据版本号
  currentDataVer: 4,

  // 本地数据版本
  getDataVer(): number {
    const v = S.getDataVer()
    return isNaN(v) ? 0 : v
  },
  saveDataVer() {
    S.setDataVer(this.currentDataVer)
  },
  // 当前选择的年
  getDefYear(): string {
    const defYear = S.getDefYear()
    if (defYear == undefined || defYear.length == 0) {
      return dateU.getCurrentYear()
    }
    return defYear
  },
  setDefYear(v: string) {
    S.setDefYear(v)
  },
  // 月预算
  getDefBudget(): number {
    let v = S.getDefBudget()
    if (isNaN(v)) return 3000
    return v
  },
  setDefBudget(v: number) {
    S.setDefBudget(v)
  },
  // 是否启用同步
  setIsSync(v: boolean) {
    S.setIsSync(v)
  },
  getIsSync(): boolean {
    return S.getIsSync()
  },
  // 同步账号ID
  setUserID(v: string) {
    S.setUserID(v)
  },
  getUserID(): string {
    return S.getUserID()
  },
  // 同步数据密码
  setDataPW(v: string) {
    S.setDataPW(v)
  },
  getDataPW(): string {
    return S.getDataPW()
  }

}