import S from './storage.js';

export default {
  list: <any>[],

  init() {
    this.list = S.getTags([])
  },
  getTag(title: string): any {
    return { tt: title, t: new Date().getTime() }
  },
  addTagTitle(title: string): Array<any> {
    const list = this.list
    const i = list.findIndex((v: any) => title == v.tt)
    if (i >= 0) this.delTagWithIndex(i)
    list.unshift(this.getTag(title))
    if (list.length > 99) list.splice(99)
    return list
  },
  delTagWithIndex(i: number) {
    this.list.splice(i, 1)
  },
  saveTags(): string {
    if (S.setTags(this.list)) {
      return ""
    }
    return "保存失败"
  }
}