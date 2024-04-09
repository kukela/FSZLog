import 'package:flutter/material.dart';

const bgColor = Color(0xff1e1e1e);
const bgBarColor = Color(0xff1d1d1d);
const bgCellColor = Color(0xff292929);
const bgItemColor = Color(0xff303030);
const borderColor = Color(0xff505050);
const mainColor = Color(0xff8183FF);

const textMainColor = Colors.white;
const textNumColor = Color(0xff7d90a9);
const textDisabledColor = Color(0xff8F8F8F);
const textPlaceholderColor = Color(0xff8F8F8F);
const textGreenColor = Color(0xff74a800);
const textYellowColor = Color(0xffcc9c00);
const textRedColor = Color(0xfffa5151);

final defTheme = ThemeData(
  scaffoldBackgroundColor: bgColor,
  appBarTheme: const AppBarTheme(
      backgroundColor: bgBarColor,
      titleTextStyle: TextStyle(color: textMainColor, fontSize: 20)),
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    backgroundColor: bgBarColor,
    selectedItemColor: mainColor,
    unselectedItemColor: Color(0xffbbbbbb),
  ),
);

const numText = TextStyle(
  fontSize: 14,
  height: 21,
  color: textNumColor,
);

final numBigText = numText.copyWith(fontSize: 18);