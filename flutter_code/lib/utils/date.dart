import 'package:intl/intl.dart';

class DateUtil {
  static final Map<int, int> _monthType = {
    0: 1,
    1: -1,
    2: 1,
    3: 0,
    4: 1,
    5: 0,
    6: 1,
    7: 1,
    8: 0,
    9: 1,
    10: 0,
    11: 1,
  };

  static String _formatTime(DateTime date) {
    final formatter = DateFormat('yyyy-MM-dd HH:mm:ss');
    return formatter.format(date);
  }

  /// 获取当前日期key
  static String getCurrentDateKey() => getYearMonthKey(DateTime.now());

  /// 获取当前年
  static String getCurrentYear() => '${DateTime.now().year}';

  /// 获取当前时间
  static String getCurrentDate() => _formatTime(DateTime.now());

  /// 日期转年月key
  static String getYearMonthKey(DateTime date) =>
      [date.year, date.month].map(formatNumber).join('-');

  /// 日期转年月日key
  static String getYearMonthDayKey(DateTime date) => [
        date.year,
        date.month,
        date.day,
      ].map(formatNumber).join('-');

  /// 日期转年月数字
  static int date2YMNum(DateTime v) => v.year * 100 + v.month;

  /// 年月num转日期key
  static String dateNum2Key(int v) {
    final arr = (v.toString()).split('');
    if (arr.length >= 6) arr.insert(4, '-');
    return arr.join('');
  }

  /// 日期key转时间
  static DateTime dateKey2Date(String v) => DateTime.parse(v);

  static int dateKey2Time(String v) => dateKey2Date(v).millisecondsSinceEpoch;

  /// 设置月份，防止最后一天溢出
  static DateTime setMonthV(DateTime v, int m, [int date = -1]) {
    v = v.copyWith(month: m);
    if (date > 0) v = v.copyWith(day: date);
    if (m != 12 && v.month != m) v = v.copyWith(day: 0);
    return v;
  }

  /// 日期月份+1
  static DateTime monthPlus(DateTime v, [int date = -1]) =>
      setMonthV(v, v.month + 1, date);

  /// 日期月份-1
  static DateTime monthMinus(DateTime v, [int date = -1]) =>
      setMonthV(v, v.month - 1, date);

  /// 计算两个日期相差天数
  static int getDaysBetween(DateTime startDate, DateTime endDate) =>
      (endDate.millisecondsSinceEpoch - startDate.millisecondsSinceEpoch) ~/
      (1 * 24 * 60 * 60 * 1000);

  static String formatNumber(int n) => n.toString().padLeft(2, '0');
}
