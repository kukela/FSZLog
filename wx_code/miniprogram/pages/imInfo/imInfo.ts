import IMData from '../../utils/IMData.js'
import dateU from '../../utils/date.js'
import verifyU from '../../utils/verify.js';

Page({
  data: {
    m: <any>{},
    ctv: 0,
    tqM: {
      show: false,
      isEdit: false,
      verifyTips: false,
      tqTypeTips: [{
        t: "请选择提前还款方式",
        f: verifyU.isEmptyFun
      }],
      tqPTips: [{
        t: "请输入正确的还款额",
        f: verifyU.isNaNFloatFun
      }, {
        t: "还款额不能低于?",
        f: function (_: string) {
          return false
        }
      }],
    },
    tqM_t: 0,
    tqM_type: "1",
    tqM_p: "",
    tqTypeList: [
      { t: "重新计算每月还款额", v: "1" }
    ],
  },
  onLoad(option) {
    const m = IMData.id2ImData(option.id)
    // const m = IMData.id2ImData("2")
    this.setData({
      m: m,
      ctv: dateU.date2YMNum(new Date())
    })
    wx.setNavigationBarTitle({
      title: m.tt
    })
    // wx.pageScrollTo({
    //   selector: `#t${this.data.ctv}`,
    //   duration: 300
    // })
    wx.createSelectorQuery()
      .select('#scrollview')
      .node()
      .exec((res) => {
        const scrollView = res[0].node;
        scrollView.scrollIntoView(`#t${this.data.ctv}`)
      })
    // console.log(m)
  },
  onShow() {
  },
  onShareAppMessage() {
    return {
      title: '反赊账记录器',
    }
  },
  onShareTimeline() {
    return {
      title: '反赊账记录器',
    }
  },
  // 列表点击事件
  cellTap(e: any) {
    const i = e.currentTarget.dataset.i
    try {
      const m = this.data.m
      const om = m.o[i]
      if (!m.tq) m.tq = []
      const tqm = m.tq.find((v: any) => v.t == om.t)
      if (om.t > this.data.ctv) {
        wx.showModal({
          title: '提示', content: '提前还款不能超过当前月份！', showCancel: false
        })
        return
      }
      const mP = om.p + om.ir
      this.setData({
        ['tqM.show']: true,
        ['tqM.isEdit']: tqm != null,
        ['tqM.tqPTips[1]']: {
          t: `还款额不能低于${mP}`,
          f: function (v: string) {
            return parseFloat(v) < mP
          }
        },
        tqM_t: om.t,
        tqM_p: tqm ? `${tqm.p}` : ""
      })
    } catch (error) {
      wx.showToast({
        title: '数据错误！', icon: 'error', duration: 2000
      })
    }
  },
  // 提前还款类型帮助
  tqTypeHelpTap() {
    let showT = ""
    let showText = ""
    const t = this.data.tqM_type
    switch (t) {
      case "1":
        showT = "重新计算每月还款额。"
        showText = "从当前还款月份开始，重新计算剩余月份的还款额。"
        break;
      default:
        showT = "提示"
        showText = `${t} 未知提前还款方式！`
        break;
    }
    wx.showModal({ title: showT, content: showText, showCancel: false })
  },
  // 添加&编辑提前还款确定
  tqModalConfirm() {
    this.setData({ ["tqM.verifyTips"]: true })
    const d = this.data
    const vTips = verifyU.vTips
    if (vTips(d.tqM.tqPTips, d.tqM_p)) {
      return
    }
    let nm = <any>{}
    if (d.tqM.isEdit) {
      nm = d.m.tq.find((v: any) => v.t == d.tqM_t)
    } else {
      nm.t = d.tqM_t
      nm.m_t = parseInt(d.tqM_type)
      d.m.tq.push(nm)
    }
    nm.p = parseFloat(d.tqM_p)
    this.saveData()
  },
  //  删除提前还款
  cellDel() {
    const m = this.data.m
    const tqmt = this.data.tqM_t
    const self = this
    wx.showModal({
      title: '提示',
      content: '删除操作后不可撤销，是否删除？',
      success(res) {
        if (!res.confirm) return
        const tqmI = m.tq.findIndex((v: any) => v.t == tqmt)
        if (tqmI < 0) {
          wx.showToast({
            title: '删除失败！', icon: 'error', duration: 2000
          })
          return
        }
        m.tq.splice(tqmI, 1)
        self.saveData()
      }
    })
  },
  // 保存数据
  saveData() {
    IMData.editDataU(this.data.m, this.tqModalConfirmSuccs)
  },
  tqModalConfirmSuccs(refList: Array<number>) {
    if (!refList || refList.length <= 0 || refList[0] == 3) {
      wx.navigateBack()
      return
    }
    IMData.imRefList = refList
    const m = IMData.id2ImData(this.data.m.id)
    this.setData({
      m: m,
      ctv: dateU.date2YMNum(new Date()),
      ['tqM.show']: false,
      ['tqM.isEdit']: false,
      ["tqM.verifyTips"]: false
    })
  },
})