import 'package:flutter/material';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../services/store.dart';
import '../models/types.dart';

class CRMScreen extends StatefulWidget {
  const CRMScreen({Key? key}) : super(key: key);

  @override
  _CRMScreenState createState() => _CRMScreenState();
}

class _CRMScreenState extends State<CRMScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _companyController = TextEditingController();
  String _status = 'lead';

  @override
  Widget build(BuildContext context) {
    final store = Provider.of<BizGenieStore>(context);
    final formatCurrency = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

    // Filtered count totals
    int leadCount = store.customers.where((c) => c.status == 'lead').length;
    int contactedCount = store.customers.where((c) => c.status == 'contacted').length;
    int customerCount = store.customers.where((c) => c.status == 'customer').length;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          Text(
            "Sales CRM & Pipeline",
            style: GoogleFonts.spaceGrotesk(
              fontSize: 22.0,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            "Engage prospects, manage sales deal pipelines, and seal custom integrations.",
            style: GoogleFonts.inter(fontSize: 12.0, color: const Color(0xFF64748B)),
          ),
          const SizedBox(height: 24.0),

          // Funnel Overview Row
          Row(
            children: [
              _buildFunnelCap("Leads", leadCount.toString(), const Color(0xFF3B82F6)),
              const SizedBox(width: 12.0),
              _buildFunnelCap("Contacted", contactedCount.toString(), const Color(0xFFF59E0B)),
              const SizedBox(width: 12.0),
              _buildFunnelCap("Closed Won", customerCount.toString(), const Color(0xFF10B981)),
            ],
          ),
          const SizedBox(height: 24.0),

          // Active Deals Pipeline
          _buildCardFrame(
            title: "Active Contract Deals",
            icon: Icons.monetization_on,
            child: ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: store.orders.length,
              itemBuilder: (context, idx) {
                final deal = store.orders[idx];
                bool isCompleted = deal.status == 'completed';

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(deal.product, style: GoogleFonts.inter(fontSize: 13.0, fontWeight: FontWeight.bold, color: Colors.white)),
                          Text("${deal.customerName} • ${deal.date}", style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF64748B))),
                        ],
                      ),
                      Row(
                        children: [
                          Text(formatCurrency.format(deal.amount), style: GoogleFonts.spaceGrotesk(fontSize: 14.0, fontWeight: FontWeight.bold, color: Colors.white)),
                          const SizedBox(width: 10.0),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 3.0),
                            decoration: BoxDecoration(
                              color: isCompleted ? const Color(0x1F10B981) : const Color(0x1FF59E0B),
                              borderRadius: BorderRadius.circular(6.0),
                            ),
                            child: Text(
                              deal.status.toUpperCase(),
                              style: GoogleFonts.spaceGrotesk(
                                fontSize: 9.0,
                                fontWeight: FontWeight.bold,
                                color: isCompleted ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
                              ),
                            ),
                          )
                        ],
                      )
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 24.0),

          // Customer Contacts list
          _buildCardFrame(
            title: "Customer & Prospect Ledger",
            icon: Icons.people,
            action: TextButton.icon(
              onPressed: () => _showAddCustomerSheet(context),
              icon: const Icon(Icons.person_add, size: 14.0),
              label: Text("New Lead", style: GoogleFonts.inter(fontSize: 12.0)),
              style: TextButton.styleFrom(foregroundColor: const Color(0xFFA78BFA)),
            ),
            child: ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: store.customers.length,
              separatorBuilder: (context, idx) => const Divider(color: Color(0xFF1E293B)),
              itemBuilder: (context, idx) {
                final cust = store.customers[idx];
                Color chipColor;
                if (cust.status == 'customer') {
                  chipColor = const Color(0xFF10B981);
                } else if (cust.status == 'contacted') {
                  chipColor = const Color(0xFFF59E0B);
                } else {
                  chipColor = const Color(0xFF3B82F6);
                }

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(cust.name, style: GoogleFonts.inter(fontSize: 14.0, fontWeight: FontWeight.bold, color: Colors.white)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 2.0),
                            decoration: BoxDecoration(
                              color: chipColor.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(4.0),
                            ),
                            child: Text(
                              cust.status.toUpperCase(),
                              style: GoogleFonts.spaceGrotesk(fontSize: 8.0, fontWeight: FontWeight.bold, color: chipColor),
                            ),
                          )
                        ],
                      ),
                      Text("${cust.company} • ${cust.email}", style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF64748B))),
                      if (cust.notes.isNotEmpty) ...[
                        const SizedBox(height: 6.0),
                        Container(
                          padding: const EdgeInsets.all(8.0),
                          decoration: BoxDecoration(
                            color: const Color(0xFF020617),
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          child: Text(
                            cust.notes,
                            style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF94A3B8), height: 1.3),
                          ),
                        )
                      ]
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFunnelCap(String title, String count, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(16.0),
          border: Border.all(color: const Color(0xFF1E293B)),
        ),
        child: Column(
          children: [
            Text(
              count,
              style: GoogleFonts.spaceGrotesk(
                fontSize: 22.0,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 4.0),
            Text(
              title,
              style: GoogleFonts.inter(
                fontSize: 11.0,
                color: const Color(0xFF64748B),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCardFrame({required String title, required IconData icon, required Widget child, Widget? action}) {
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
              if (action != null) action,
            ],
          ),
          const Divider(color: Color(0xFF1E293B), height: 20.0),
          child,
        ],
      ),
    );
  }

  void _showAddCustomerSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0F172A),
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24.0))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                top: 24.0,
                left: 24.0,
                right: 24.0,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24.0,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text("Add CRM Lead Record", style: GoogleFonts.spaceGrotesk(fontSize: 18.0, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 16.0),
                  TextField(
                    controller: _nameController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(labelText: "Client Full Name", labelStyle: TextStyle(color: Color(0xFF64748B))),
                  ),
                  const SizedBox(height: 12.0),
                  TextField(
                    controller: _emailController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(labelText: "Client Email", labelStyle: TextStyle(color: Color(0xFF64748B))),
                  ),
                  const SizedBox(height: 12.0),
                  TextField(
                    controller: _companyController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(labelText: "Company Name", labelStyle: TextStyle(color: Color(0xFF64748B))),
                  ),
                  const SizedBox(height: 16.0),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ChoiceChip(
                        label: const Text("Lead"),
                        selected: _status == 'lead',
                        selectedColor: const Color(0xFF3B82F6).withOpacity(0.2),
                        labelStyle: TextStyle(color: _status == 'lead' ? const Color(0xFF3B82F6) : Colors.white),
                        onSelected: (sel) {
                          if (sel) setSheetState(() => _status = 'lead');
                        },
                      ),
                      ChoiceChip(
                        label: const Text("Contacted"),
                        selected: _status == 'contacted',
                        selectedColor: const Color(0xFFF59E0B).withOpacity(0.2),
                        labelStyle: TextStyle(color: _status == 'contacted' ? const Color(0xFFF59E0B) : Colors.white),
                        onSelected: (sel) {
                          if (sel) setSheetState(() => _status = 'contacted');
                        },
                      ),
                      ChoiceChip(
                        label: const Text("Customer"),
                        selected: _status == 'customer',
                        selectedColor: const Color(0xFF10B981).withOpacity(0.2),
                        labelStyle: TextStyle(color: _status == 'customer' ? const Color(0xFF10B981) : Colors.white),
                        onSelected: (sel) {
                          if (sel) setSheetState(() => _status = 'customer');
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 24.0),
                  ElevatedButton(
                    onPressed: () {
                      final store = Provider.of<BizGenieStore>(context, listen: false);
                      store.addCustomer(Customer(
                        id: "c-${DateTime.now().millisecondsSinceEpoch}",
                        name: _nameController.text.trim(),
                        email: _emailController.text.trim(),
                        company: _companyController.text.trim(),
                        phone: "+1 (555) 222-3333",
                        status: _status,
                        notes: "Lead captured dynamically on CRM board.",
                        lastInteraction: DateTime.now().toIso8601String().split('T')[0],
                      ));
                      _nameController.clear();
                      _emailController.clear();
                      _companyController.clear();
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF7C3AED)),
                    child: const Text("Commit Lead"),
                  )
                ],
              ),
            );
          },
        );
      },
    );
  }
}
