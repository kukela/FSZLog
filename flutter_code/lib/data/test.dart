import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class TestData {
  static late SharedPreferences _sp;

  static init() async {
    _sp = await SharedPreferences.getInstance();

//     _sp.clear();
//
//     final ydata = [
//       {
//         "date": "2024-03",
//         "budget": 3000,
//         "list": [
//           {"tt": "京东", "p": "-100", "t": "01 18:00:01"},
//           {"tt": "支付宝", "p": "-1000.1", "t": "02 18:00:01"},
//           {"tt": "京东", "p": "-101", "t": "03 18:00:01"}
//         ]
//       }
//     ];
//     _sp.setString("ydata-2024", jsonEncode(ydata));
//
//     const t_2023_8 = {
//       'budget': 3000,
//       'listS': '',
//     };
//     const t_2023_9 = {
//       'budget': 3000,
//       'listS': 'ABCd | -4000 | 10 18:00:01',
//     };
//     const t_2024_02 = {
//       'budget': 3000,
//       'listS': 'ABCd | -4000 | 10 18:00:01',
//     };
//     const t_2024_03 = {
//       'budget': 3000,
//       'listS': '''
// 京东 | -100 | 01 18:00:01
// 支付宝 | -1000.1 | 02 12:01:01
// 京东 | +100 | 03 15:03:01
// 京东 | -100 | 04 17:24:01
// ABC_1 | -100 | 01 18:00:01
// ''',
//     };
//     _sp.setString("md-2023-08", jsonEncode(t_2023_8));
//     _sp.setString("md-2023-09", jsonEncode(t_2023_9));
//     _sp.setString("md-2023-12", jsonEncode(t_2023_9));
//     _sp.setString("md-2024-02", jsonEncode(t_2024_02));
//     _sp.setString("md-2024-03", jsonEncode(t_2024_03));
//
//     const List<Map<String, dynamic>> tags = [
//       {'tt': '京东', 't': 1710554711754},
//       {'tt': '支付宝', 't': 1710554711754},
//       {'tt': 'ABC_1', 't': 1710554711754},
//     ];
//     _sp.setString("tags", jsonEncode(tags));
//
//     _sp.remove("md-2024-03");
//
//     const ioStr = '''
// ABC | 2024-03-01 12:01:01 | -1000.10
// ABCd | 2024-03-02 12:01:03 | +100
// ''';
//
//     _sp.remove("installment");
//
//     const testIM = '''
// 1 | 贷款1 | 10000 | 等额本息_3.99 | 36 | 2024-01-11 | 2024-02 | 202403_1000_1,202601_2000_1,202610_505_1
// 2 | 贷款2 | 10000 | 等额本金_3.99 | 36 | 2022-11-11 | 2023-02 | 202503_2000_1
// 4 | 自行车2 | 598.8 | 免息 | 13 | 2023-12-11 | 2024-01
// 7 | 自行车5 | 611 | 免息 | 3 | 2024-04-11 | 2024-05
// ''';
//     const testIM2 = '''
// 3 | 自行车1 | 598.8 | 免息 | 12 | 2023-12-11 | 2024-01 | 202403_499_1
// 5 | 自行车3 | 601 | 免息 | 10 | 2023-03-11 | 2023-04
// 6 | 自行车4 | 601 | 免息 | 10 | 2023-03-11 | 2023-04
// ''';
//     _sp.setString("installment", testIM + testIM2);
  }
}
