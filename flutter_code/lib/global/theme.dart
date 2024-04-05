import 'package:flutter/material.dart';

final ThemeData defTheme = ThemeData(
  // canvasColor: Colors.red,
  scaffoldBackgroundColor: const Color(0xff1e1e1e),
  appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xff1d1d1d),
      titleTextStyle: TextStyle(color: Colors.white, fontSize: 20)),
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    backgroundColor: Color(0xff1d1d1d),
    selectedItemColor: Color(0xff8183FF),
    unselectedItemColor: Color(0xffbbbbbb),
  ),
);
