import 'package:flutter/material';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import '../services/store.dart';
import '../models/types.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({Key? key}) : super(key: key);

  @override
  _AnalyticsScreenState createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  String _timeRange = '6M';

  @override
  Widget build(BuildContext context) {
    final store = Provider.of<BizGenieStore>(context);
    final formatCurrency = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Analytics & Curves",
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 22.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      "Track multi-tenant cash flow indexes and contract growth.",
                      style: GoogleFonts.inter(fontSize: 12.0, color: const Color(0xFF64748B)),
                    ),
                  ],
                ),
              ),
              DropdownButton<String>(
                value: _timeRange,
                dropdownColor: const Color(0xFF0F172A),
                style: GoogleFonts.inter(color: Colors.white, fontSize: 12.0),
                underline: Container(),
                items: const [
                  DropdownMenuItem(value: '1M', child: Text("1 Month")),
                  DropdownMenuItem(value: '6M', child: Text("6 Months")),
                  DropdownMenuItem(value: '1Y', child: Text("1 Year")),
                ],
                onChanged: (val) {
                  if (val != null) setState(() => _timeRange = val);
                },
              )
            ],
          ),
          const SizedBox(height: 24.0),

          // Growth Curve Chart using fl_chart
          _buildCardFrame(
            title: "Net Operational Revenue (Profitability Trend)",
            icon: Icons.analytics_outlined,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                SizedBox(
                  height: 180,
                  child: LineChart(
                    LineChartData(
                      gridData: FlGridData(
                        show: true,
                        drawVerticalLine: false,
                        getDrawingHorizontalLine: (value) {
                          return FlLine(
                            color: const Color(0xFF1E293B),
                            strokeWidth: 1,
                          );
                        },
                      ),
                      titlesData: FlTitlesData(
                        show: true,
                        rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                        topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                        bottomTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            reservedSize: 22,
                            interval: 1,
                            getTitlesWidget: (value, meta) {
                              String text = '';
                              switch (value.toInt()) {
                                case 1:
                                  text = 'Feb';
                                  break;
                                case 2:
                                  text = 'Mar';
                                  break;
                                case 3:
                                  text = 'Apr';
                                  break;
                                case 4:
                                  text = 'May';
                                  break;
                                case 5:
                                  text = 'Jun';
                                  break;
                                case 6:
                                  text = 'Jul';
                                  break;
                              }
                              return SideTitleWidget(
                                axisSide: meta.axisSide,
                                child: Text(
                                  text,
                                  style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 10.0),
                                ),
                              );
                            },
                          ),
                        ),
                        leftTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            interval: 5000,
                            getTitlesWidget: (value, meta) {
                              return Text(
                                meta.formattedValue,
                                style: GoogleFonts.spaceGrotesk(color: const Color(0xFF64748B), fontSize: 9.0),
                              );
                            },
                            reservedSize: 32,
                          ),
                        ),
                      ),
                      borderData: FlBorderData(
                        show: false,
                      ),
                      minX: 1,
                      maxX: 6,
                      minY: 0,
                      maxY: 20000,
                      lineBarsData: [
                        LineChartBarData(
                          spots: const [
                            FlSpot(1, 4500),
                            FlSpot(2, 6200),
                            FlSpot(3, 9800),
                            FlSpot(4, 11500),
                            FlSpot(5, 15400),
                            FlSpot(6, 19700),
                          ],
                          isCurved: true,
                          gradient: const LinearGradient(
                            colors: [Color(0xFF7C3AED), Color(0xFFD946EF)],
                          ),
                          barWidth: 4,
                          isStrokeCapRound: true,
                          dotData: FlDotData(show: true),
                          belowBarData: BarAreaData(
                            show: true,
                            gradient: LinearGradient(
                              colors: [
                                const Color(0xFF7C3AED).withOpacity(0.2),
                                const Color(0xFFD946EF).withOpacity(0.0),
                              ],
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12.0),
                Center(
                  child: Text(
                    "Profits climbed 24% YoY, heavily powered by Consulting services.",
                    style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF94A3B8), fontStyle: FontStyle.italic),
                  ),
                )
              ],
            ),
          ),
          const SizedBox(height: 24.0),

          // Business health indexes
          _buildCardFrame(
            title: "Operating Health Metrics",
            icon: Icons.health_and_safety_outlined,
            child: Column(
              children: [
                _buildMetricRow("Profit Margins", "57%", "Healthy baseline", const Color(0xFF10B981)),
                const Divider(color: Color(0xFF1E293B)),
                _buildMetricRow("Monthly Churn Rate", "1.2%", "Extremely low churn", const Color(0xFF10B981)),
                const Divider(color: Color(0xFF1E293B)),
                _buildMetricRow("Customer Acq. Cost (CAC)", "₹1,200", "LTV/CAC ratio is 11.4x", const Color(0xFF10B981)),
                const Divider(color: Color(0xFF1E293B)),
                _buildMetricRow("Burn Rate", "None", "Cashflow self-sustaining", const Color(0xFF10B981)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricRow(String label, String value, String subtitle, Color statusColor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: GoogleFonts.inter(fontSize: 13.0, fontWeight: FontWeight.bold, color: Colors.white)),
              Text(subtitle, style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF64748B))),
            ],
          ),
          Text(
            value,
            style: GoogleFonts.spaceGrotesk(
              fontSize: 16.0,
              fontWeight: FontWeight.bold,
              color: statusColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCardFrame({required String title, required IconData icon, required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(20.0),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Icon(icon, color: const Color(0xFF818CF8), size: 18.0),
              const SizedBox(width: 8.0),
              Text(
                title,
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 15.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const Divider(color: Color(0xFF1E293B), height: 20.0),
          child,
        ],
      ),
    );
  }
}
