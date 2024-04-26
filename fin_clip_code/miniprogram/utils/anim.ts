import util from './util.js';

export default {
  // 列表动画时长
  anim_list_d: 198,

  // 展开子列表动画
  cellSubShowHide(self: any, key: string, isAnim: boolean = true, showType: number = -1): any {
    let m = util.key2Obj(self.data, key)
    if (m.isSSA != undefined && m.isSS != m.isSSA) return
    let isSS = false
    switch (showType) {
      case 1:
        isSS = true
        break;
      case 0:
        isSS = false
        break;
      default:
        isSS = !m.isSS
        break;
    }
    if (isAnim) {
      self.setData({ [`${key}.isSSA`]: isSS })
      setTimeout(() => {
        self.setData({ [`${key}.isSS`]: isSS })
      }, 0);
    // }, isSS ? 0 : this.anim_list_d);
    } else {
      self.setData({ [`${key}.isSS`]: isSS })
    }
    return m
  },

  // 设置数组所有isShowSub
  setAllShowSub(list: Array<any>, isSS: boolean) {
    list.forEach((m: any) => {
      m.isSS = isSS
      m.isSSA = isSS
    });
  },

  // 覆盖isShowSub数据
  coverIsShowSub(newL: Array<any>, oldL: Array<any>, key: string) {
    if (!newL || newL.length < 1 || !oldL || oldL.length < 1) return
    const isShowSubM: any = {}
    oldL.forEach(v => {
      isShowSubM[v[key]] = v.isSS
    });
    newL.forEach(v => {
      const isSS = isShowSubM[v[key]]
      if (isSS != undefined && isSS != null) {
        v.isSS = isSS
        v.isSSA = isSS
      }
    });
  },

}