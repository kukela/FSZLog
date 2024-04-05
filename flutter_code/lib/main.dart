import 'package:flutter/material.dart';
import 'package:flutter_code/global/conf.dart';
import 'package:flutter_code/page/index_page.dart';
import 'package:flutter_code/global/theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    Conf.init();

    return MaterialApp(
      title: '反赊账记录器',
      theme: defTheme,
      home: const IndexPage(),
    );
  }
}