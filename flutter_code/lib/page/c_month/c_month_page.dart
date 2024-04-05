import 'package:flutter/material.dart';
import 'package:flutter_code/global/conf.dart';
import 'package:flutter_code/utils/date.dart';
import 'package:flutter_code/utils/util.dart';

class CMonthPage extends StatefulWidget {
  const CMonthPage({super.key});

  @override
  State<CMonthPage> createState() => _CMonthPageState();
}

class _CMonthPageState extends State<CMonthPage> {
  void _incrementCounter() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {

    // var to = PriceIO("11");
    // print(MyUtil.key2Obj(to, "pio"));

    return Scaffold(
      appBar: AppBar(
        title: const Text("本月"),
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[Text('本月')],
        ),
      ),
    );
  }
}
