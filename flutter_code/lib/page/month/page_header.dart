import 'package:flutter/material.dart';
import 'package:flutter_code/theme.dart';

class PageHeader extends StatelessWidget {
  final double budget = 100;
  final String perType = "";
  final double per = 100;

  // final VoidCallback onBudgetTap;

  const PageHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('预算:', style: numText),
                Text(budget.toStringAsFixed(2), style: numBigText),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '剩余:',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                // Text(
                //   p2s(budget * (1 - per / 100)),
                //   style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                // ),
              ],
            ),
            SizedBox(height: 8),
            LinearProgressIndicator(
              value: per / 100,
              backgroundColor: Colors.grey[300],
              // valueColor: _getProgressColor(perType),
            ),
          ],
        ),
      ),
    );
  }

  Color _getProgressColor(String perType) {
    switch (perType) {
      case 'type1':
        return Colors.green;
      case 'type2':
        return Colors.orange;
      default:
        return Colors.blue; // 或者其他默认颜色
    }
  }
}
