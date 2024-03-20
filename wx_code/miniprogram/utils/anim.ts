import util from './util.js';

export default {
  // 列表动画时长
  anim_list_d: 1180,

  cellSubShowHide(self: any, key: string, isAnim: boolean = true): any {
    let m = util.key2Obj(self.data, key)
    if (m.isShowSubAnim != undefined && m.isShowSub != m.isShowSubAnim) return
    const isShowSub = !m.isShowSub
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

}