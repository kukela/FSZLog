import 'package:flutter/material.dart';
import 'package:flutter_code/page/month/page_header.dart';

class MonthPage extends StatefulWidget {
  const MonthPage({super.key});

  @override
  State<MonthPage> createState() => _MonthPageState();
}

class _MonthPageState extends State<MonthPage> {
  void _incrementCounter() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("本月"),
      ),
      body: const Center(
        child: Column(
          children: <Widget>[
            PageHeader()
          ],
        ),
      ),
    );
  }


}
