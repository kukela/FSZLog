import util from './util.js';

export default {
  // 列表动画时长
  anim_list_d: 180,

  // 展开子列表动画
  cellSubShowHide(self: any, key: string, isAnim: boolean = true, showType: number = -1): any {
    let m = util.key2Obj(self.data, key)
    if (m.isShowSubAnim != undefined && m.isShowSub != m.isShowSubAnim) return
    let isShowSub = false
    switch (showType) {
      case 1:
        isShowSub = true
        break;
      case 0:
        isShowSub = false
        break;
      default:
        isShowSub = !m.isShowSub
        break;
    }
    if (isAnim) {
      self.setData({ [`${key}.isShowSubAnim`]: isShowSub })
      setTimeout(() => {
        self.setData({ [`${key}.isShowSub`]: isShowSub })
      }, isShowSub ? 0 : this.anim_list_d);
    } else {
      self.setData({ [`${key}.isShowSub`]: isShowSub })
    }
    return m
  },

  // 设置数组所有isShowSub
  setAllShowSub(list: Array<any>, isShowSub: boolean) {
    list.forEach((m: any) => {
      m.isShowSub = isShowSub
      m.isShowSubAnim = isShowSub
    });
  },

  // 覆盖isShowSub数据
  coverIsShowSub(newL: Array<any>, oldL: Array<any>, key: string) {
    if (!newL || newL.length < 1 || !oldL || oldL.length < 1) return
    const isShowSubM: any = {}
    oldL.forEach(v => {
      isShowSubM[v[key]] = v.isShowSub
    });
    newL.forEach(v => {
      const isShowSub = isShowSubM[v[key]]
      if (isShowSub != undefined && isShowSub != null) {
        v.isShowSub = isShowSub
        v.isShowSubAnim = isShowSub
      }
    });
  },

}