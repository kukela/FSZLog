import 'package:shared_preferences/shared_preferences.dart';

class Conf {
  // 0 正式环境
  static int env = 1;

  // 当前数据版本号
  static int currentDataVer = 2;

  // 月数据key开头
  static String monthDataKey = "md-";

  static late SharedPreferences _sp;

  static init() async {
    _sp = await SharedPreferences.getInstance();
  }

  /// 本地数据版本
  static int getDataVer() {
    return _sp.getInt("dataVer") ?? 0;
  }

  static void saveDataVer() {
    _sp.setInt("dataVer", currentDataVer);
  }

  /// 获取当前选择的年
  static String getDefYear() {
    String defYear = _sp.getString("defYear") ?? "";
    if (defYear.isEmpty) {
      return DateTime.now().year.toString();
    }
    return defYear;
  }

  /// 设置当前选择的年
  static void setDefYear(String v) {
    _sp.setString("defYear", v);
  }

  /// 获取预算
  static double getDefBudget() {
    return _sp.getDouble("defBudget") ?? 3000;
  }

  /// 设置预算
  static void setDefBudget(double v) {
    _sp.setDouble("defBudget", v);
  }

  /// 获取年数据key
  static String getMonthDataKey(String month) {
    return "$monthDataKey$month";
  }
}
