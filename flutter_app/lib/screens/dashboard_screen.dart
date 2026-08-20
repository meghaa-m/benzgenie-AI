import 'package:flutter/material';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../services/store.dart';
import '../models/types.dart';

class DashboardScreen extends StatelessWidget {
  final Function(String, {String? quickPrompt}) onNavigate;

  const DashboardScreen({Key? key, required this.onNavigate}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final store = Provider.of<BizGenieStore>(context);
    final formatCurrency = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
    final profile = store.profile;

    // Financial totals
    double totalIncome = store.transactions
        .where((t) => t.type == 'income')
        .fold(0.0, (sum, t) => sum + t.amount);
    double totalExpense = store.transactions
        .where((t) => t.type == 'expense')
        .fold(0.0, (sum, t) => sum + t.amount);
    double netReserve = totalIncome - totalExpense;

    // Notifications alert
    int unreadCount = store.notifications.where((n) => !n.read).length;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header Welcome Area
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Welcome back, ${profile.name}!",
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 24.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4.0),
                    Row(
                      children: [
                        const Icon(Icons.location_city, color: Color(0xFF94A3B8), size: 14.0),
                        const SizedBox(width: 4.0),
                        Expanded(
                          child: Text(
                            "${profile.companyName} • ${profile.industry}",
                            style: GoogleFonts.inter(
                              fontSize: 12.0,
                              color: const Color(0xFF94A3B8),
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Plan indicator
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 4.0),
                decoration: BoxDecoration(
                  color: const Color(0x26818CF8), // 15% indigo-400
                  borderRadius: BorderRadius.circular(100),
                  border: Border.all(color: const Color(0x3D818CF8)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.auto_awesome, color: Color(0xFFC084FC), size: 12.0),
                    const SizedBox(width: 4.0),
                    Text(
                      profile.subscription.toUpperCase(),
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 10.0,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFFC084FC),
                      ),
                    ),
                  ],
                ),
              )
            ],
          ),
          const SizedBox(height: 24.0),

          // Alert banner if any unread urgent alerts exist
          if (unreadCount > 0)
            GestureDetector(
              onTap: () => onNavigate('profile'), // Go to settings/profile notifications
              child: Container(
                margin: const EdgeInsets.bottom(24.0),
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0x33F43F5E), Color(0x1AF43F5E)],
                  ),
                  borderRadius: BorderRadius.circular(16.0),
                  border: Border.all(color: const Color(0x40F43F5E)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.warning_amber_rounded, color: Color(0xFFFB7185), size: 20.0),
                    const SizedBox(width: 12.0),
                    Expanded(
                      child: Text(
                        "You have $unreadCount unread action alerts in your pipeline.",
                        style: GoogleFonts.inter(
                          fontSize: 12.0,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFFFECDD3),
                        ),
                      ),
                    ),
                    const Icon(Icons.chevron_right, color: Color(0xFFFB7185), size: 16.0),
                  ],
                ),
              ),
            ),

          // Bento-Grid Score Metrics
          GridView.count(
            crossAxisCount: 2,
            crossAxisSpacing: 16.0,
            mainAxisSpacing: 16.0,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 1.4,
            children: [
              _buildBentoCard(
                "Health Score",
                "88/100",
                Icons.favorite,
                const Color(0xFF10B981), // Emerald
                "Stable & Growing",
              ),
              _buildBentoCard(
                "Cash Runway",
                "8.5 mos",
                Icons.speed,
                const Color(0xFF8B5CF6), // Violet
                "Goal: > 12 mos",
              ),
              _buildBentoCard(
                "Net Reserve",
                formatCurrency.format(netReserve),
                Icons.account_balance_wallet,
                const Color(0xFF3B82F6), // Blue
                "+15.4% growth",
              ),
              _buildBentoCard(
                "CRM Pipeline",
                "${store.customers.where((c) => c.status == 'customer').length} clients",
                Icons.group_work,
                const Color(0xFFF59E0B), // Amber
                "${store.customers.length} total contacts",
              ),
            ],
          ),
          const SizedBox(height: 24.0),

          // AI Quick Co-Pilot Prompt Section
          Text(
            "Ask BizGenie AI (Quick Prompts)",
            style: GoogleFonts.spaceGrotesk(
              fontSize: 16.0,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 12.0),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildQuickPromptButton(
                  "Optimize Cloud Bill",
                  "Suggest strategies to optimize my cloud & AWS infrastructure bill.",
                ),
                _buildQuickPromptButton(
                  "Draft Overdue Email",
                  "Draft a professional overdue payment email reminder for client Algonquin Agency.",
                ),
                _buildQuickPromptButton(
                  "Improve HR Hiring",
                  "What skills should I screen for a Technical Product Manager role?",
                ),
              ],
            ),
          ),
          const SizedBox(height: 28.0),

          // Strategic Advisory & Insights
          Container(
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(20.0),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.lightbulb, color: Color(0xFFFBBF24), size: 20.0),
                    const SizedBox(width: 8.0),
                    Text(
                      "AI Strategic Advisory Reports",
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 15.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                const Divider(color: Color(0xFF1E293B), height: 24.0),
                _buildAdvisoryItem(
                  "Optimize Software Infrastructure Budgets",
                  "AWS bill grew 12% last month. Transitioning caching microservices to serverless can save ₹35,000/mo.",
                  "High Priority",
                  const Color(0xFFEF4444),
                ),
                const Divider(color: Color(0xFF0F172A), height: 16.0),
                _buildAdvisoryItem(
                  "Recover Uncollected Invoices",
                  "Invoice #INV-2026-003 (₹3,200) has expired. Trigger an automated follow-up loop.",
                  "High Priority",
                  const Color(0xFFEF4444),
                ),
                const Divider(color: Color(0xFF0F172A), height: 16.0),
                _buildAdvisoryItem(
                  "Generate Professional Sourcing Pipeline",
                  "Zenith Tech engineering capacity is capped. Create optimized social posting copy to source a PM helper.",
                  "Medium Priority",
                  const Color(0xFFF59E0B),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24.0),

          // Upcoming Calendar Events widget
          Container(
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(20.0),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Upcoming Business Events",
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 15.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const Icon(Icons.calendar_month, color: Color(0xFF818CF8), size: 18.0),
                  ],
                ),
                const SizedBox(height: 16.0),
                ...store.events.map((ev) => Padding(
                  padding: const EdgeInsets.only(bottom: 12.0),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
                        decoration: BoxDecoration(
                          color: ev.category == 'deadline' ? const Color(0x26EF4444) : const Color(0x263B82F6),
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                        child: Text(
                          ev.time,
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 10.0,
                            fontWeight: FontWeight.bold,
                            color: ev.category == 'deadline' ? const Color(0xFFFCA5A5) : const Color(0xFF93C5FD),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12.0),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              ev.title,
                              style: GoogleFonts.inter(
                                fontSize: 13.0,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            if (ev.description != null)
                              Text(
                                ev.description!,
                                style: GoogleFonts.inter(
                                  fontSize: 11.0,
                                  color: const Color(0xFF64748B),
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                          ],
                        ),
                      ),
                      Text(
                        ev.date,
                        style: GoogleFonts.inter(
                          fontSize: 11.0,
                          color: const Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                )).toList(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBentoCard(String title, String val, IconData icon, Color color, String footer) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(20.0),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: GoogleFonts.inter(
                  fontSize: 12.0,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF64748B),
                ),
              ),
              Icon(icon, color: color, size: 16.0),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                val,
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 20.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 2.0),
              Text(
                footer,
                style: GoogleFonts.inter(
                  fontSize: 10.0,
                  color: const Color(0xFF94A3B8),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildQuickPromptButton(String text, String fullPrompt) {
    return Builder(
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.only(right: 8.0),
          child: ActionChip(
            backgroundColor: const Color(0xFF1E293B),
            side: const BorderSide(color: Color(0xFF334155)),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
            avatar: const Icon(Icons.flash_on, color: Color(0xFFA78BFA), size: 14.0),
            label: Text(
              text,
              style: GoogleFonts.inter(
                fontSize: 12.0,
                color: const Color(0xFFE2E8F0),
                fontWeight: FontWeight.w600,
              ),
            ),
            onPressed: () {
              onNavigate('assistant', quickPrompt: fullPrompt);
            },
          ),
        );
      }
    );
  }

  Widget _buildAdvisoryItem(String title, String desc, String priorityText, Color priorityColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                title,
                style: GoogleFonts.inter(
                  fontSize: 13.0,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFFF8FAFC),
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 2.0),
              decoration: BoxDecoration(
                color: priorityColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(4.0),
              ),
              child: Text(
                priorityText,
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 9.0,
                  fontWeight: FontWeight.bold,
                  color: priorityColor,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 6.0),
        Text(
          desc,
          style: GoogleFonts.inter(
            fontSize: 11.0,
            color: const Color(0xFF94A3B8),
            height: 1.4,
          ),
        ),
      ],
    );
  }
}
