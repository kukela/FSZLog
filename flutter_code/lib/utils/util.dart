class MyUtil {
  /// 价格转字符串
  static String price2Str(double v, [String currency = "￥"]) {
    if (v.isNaN) return "";
    return v.toInt() == v ? "$v" : v.toStringAsFixed(2);
  }

  /// 价格转+-字符串
  static String price2IOStr(double v, [String currency = "￥"]) {
    final vs = price2Str(v, currency);
    return double.parse(vs) > 0 ? "+$vs" : vs;
  }

  /// +-价格转obj
  static PriceIO pio2Obj(dynamic v) {
    return PriceIO(v);
  }

  // 通过key获取对象属性
  static dynamic key2Obj(dynamic obj, String key, [dynamic defaultValue]) {
    var result = obj;
    var i = 0;
    final paths = key
        .replaceAllMapped(RegExp(r'\[(\d+)\]'), (_) => '.${_.group(1)}')
        .split('.');
    // console.log(paths, '--')
    while (i < paths.length) {
      result = result[paths[i]];
      if (result == null) {
        return defaultValue;
      }
      i++;
    }
    return result;
  }
}

class PriceIO {
  String pio = "";
  double p = 0;

  PriceIO(dynamic v) {
    final vv = double.parse("$v");
    pio = vv < 0 ? "out" : "in";
    p = vv < 0 ? -vv : vv;
  }

  @override
  String toString() {
    return "$pio : $p";
  }
}
