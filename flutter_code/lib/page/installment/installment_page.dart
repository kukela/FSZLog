import 'package:flutter/material.dart';

class InstallmentPage extends StatefulWidget {
  const InstallmentPage({super.key});

  @override
  State<InstallmentPage> createState() => _InstallmentPageState();
}

class _InstallmentPageState extends State<InstallmentPage> {
  void _incrementCounter() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("分期"),
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[Text('分期')],
        ),
      ),
    );
  }
}
