import 'package:flutter/material.dart';

class LogsPage extends StatefulWidget {
  const LogsPage({super.key});

  @override
  State<LogsPage> createState() => _LogsPageState();
}

class _LogsPageState extends State<LogsPage> {
  void _incrementCounter() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("历史"),
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[Text('历史')],
        ),
      ),
    );
  }
}
