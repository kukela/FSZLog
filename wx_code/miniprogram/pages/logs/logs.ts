import dataU from '../../utils/data.js'

Component({
  data: {
    date: '',
    startDate: '',
    endDate: '',
    list: <any>[],
    importM: {
      show: false,
      list: <any>[],
    }
  },
  lifetimes: {
    attached: function () {
    }
  },
  pageLifetimes: {
    show: function () {
      const yearList = dataU.getYearDataKeys(true)
      let defYear = dataU.getDefYear()
      let minDate = parseInt(defYear)
      yearList.forEach((v: string) => {
        let vv = parseInt(v)
        if (vv < minDate) {
          minDate = vv
        }
      });
      let list = dataU.year2List(defYear, true)
      dataU.coverYearIsShowSub(list, this.data.list)
      this.setData({
        date: defYear,
        startDate: `${minDate}`,
        endDate: dataU.getCurrentYear(),
        list: list
      })
    }
  },
  methods: {
    copyTap() {
      let copyStr = dataU.yearList2CopyStr(this.data.list)
      if (copyStr.length > 0) {
        // console.log(copyStr)
        wx.setClipboardData({
          data: 'data',
          success() {
            wx.showToast({ title: '本年数据已复制', icon: 'success' })
          },
          fail() {
            wx.showToast({ title: '复制失败！', icon: 'error', duration: 2000 })
          }
        })
      } else {
        wx.showToast({ title: '暂无数据', icon: 'error', duration: 2000 })
      }
    },
    importTap() {
      let self = this
      wx.getClipboardData({
        success(res) {
          self.importStrData(res.data)
        },
        fail() {
          wx.showToast({ title: '剪贴板复制失败', icon: 'error', duration: 2000 })
        }
      })
    },
    importStrData(v: string) {
      let ioStr = `
-$budget- | 3000 | 2024-03
ABC | -1000.10 | 2024-03-01 12:01:01
ABCd | -100 | 2024-03-01 12:01:02
ABC1 | -10 | 2024-03-02 12:01:01
ABC2 | +101.1 | 2024-03-03 12:01:01
ABC3 | -10.1 | 2024-03-04 12:01:01
ABC4 | -10.10 | 2024-03-51 12:01:01
      `
      console.log(v)
      let list = dataU.importYearListStr(ioStr)
      if (list.length < 1) {
        wx.showToast({ title: '剪贴板数据不对', icon: 'error', duration: 2000 })
        return
      }
      this.setData({
        ["importM.list"]: list,
        ["importM.show"]: true
      })
    },
    importModalConfirm() {
      let list = this.data.importM.list
      if (dataU.importListData(list)) {
        wx.showToast({ title: '导入成功', icon: 'success' })
      } else {
        wx.showToast({ title: '导入失败', icon: 'error', duration: 2000 })
      }
    },
    bindDateChange(e: any) {
      let date = e.detail.value
      this.setData({
        date: date,
        list: dataU.year2List(date, true)
      })
      dataU.setDefYear(date)
    },
    cellTitleTap(e: any) {
      let i = e.currentTarget.dataset.i
      let vv = this.data.list[i] as any
      vv.isShowSub = !vv.isShowSub
      this.setData({ list: this.data.list })
    }
  }
})
