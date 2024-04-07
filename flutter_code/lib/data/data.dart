
import 'dart:ffi';

import 'package:flutter_code/data/test.dart';
import 'package:flutter_code/global/conf.dart';

class Data {

  /// app打开初始化数据
  static init()  {
    if(Conf.env != 0) TestData.init();

    // int ver =  Conf.getDataVer();
    Conf.saveDataVer();

    // let m = data.date2DataObj(dateU.getCurrentDateKey(), 2)
    // if (!m) {
    //   m = data.newMonthData()
    //   IOData.saveMonthData(m)
    // }
    // IMData.init()
  }

  /// 新建当月的月份数据
  static newMonthData() {
    final nm = {
      'budget': Conf.getDefBudget(),
      'date': Conf.getDefYear(),
      'listS': ""
    };
    // Data.monthCalc(nm, 2);
    return nm;
  }

  /**
   * 获取所有月数据key
   * @param isMonth 返回月份
   * @param sort 0（不排序）、1（从小到大）、2（从大到小）
   * @param year 按照年筛选
   */
  ///
  ///
  static getMonthDataKeys(Bool isMonth, [int sort = 0, String year = ""]) {
  }

}