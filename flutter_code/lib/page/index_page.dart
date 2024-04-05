import 'package:flutter/material.dart';
import 'package:flutter_code/page/c_month/c_month_page.dart';
import 'package:flutter_code/page/installment/installment_page.dart';
import 'package:flutter_code/page/logs/logs_page.dart';

class IndexPage extends StatefulWidget {
  const IndexPage({super.key});

  @override
  State<IndexPage> createState() => _IndexPageState();
}

class _IndexPageState extends State<IndexPage> {
  final List tabBodies = [
    const CMonthPage(),
    const InstallmentPage(),
    const LogsPage(),
  ];

  int currentIndex = 0;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: tabBodies[currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Image(image: AssetImage('images/ic_tabbar_by/ic_tabbar_by.png')),
            activeIcon: Image(image: AssetImage('images/ic_tabbar_by_s/ic_tabbar_by_s.png')),
            label: '本月',
          ),
          BottomNavigationBarItem(
            icon: Image(image: AssetImage('images/ic_tabbar_installment/ic_tabbar_installment.png')),
            activeIcon: Image(image: AssetImage('images/ic_tabbar_installment_s/ic_tabbar_installment_s.png')),
            label: '分期',
          ),
          BottomNavigationBarItem(
            icon: Image(image: AssetImage('images/ic_tabbar_log/ic_tabbar_log.png')),
            activeIcon: Image(image: AssetImage('images/ic_tabbar_log_s/ic_tabbar_log_s.png')),
            label: '历史',
          ),
        ],
        currentIndex: currentIndex,
        onTap: (index) {
          setState(() {
            currentIndex = index;
          });
        },
      ),
    );
  }
}
