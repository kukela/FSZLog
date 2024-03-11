import data from './data.js';

export default {
  // 获取所有tag数组
  getAddTagList(): string[] {
    let tagList: string[] = []
    let list = data.getYearDataKeys(true)
    list.sort((a: any, b: any) => parseInt(b) - parseInt(a));
    list.forEach((year: string) => {
      let mList = data.year2List(year, false)
      mList.forEach((m: any) => {
        data.sortMonthTagData(m)
        m.list.forEach((t: any) => {
          if (!t.tt) return
          if (tagList.indexOf(t.tt) == -1) {
            tagList.push(t.tt)
          }
        });
      });
    });
    return tagList
  }
}