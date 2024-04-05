import 'package:flutter/material.dart';

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
