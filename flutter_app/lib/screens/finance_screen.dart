import 'package:flutter/material';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../services/store.dart';
import '../models/types.dart';

class FinanceScreen extends StatefulWidget {
  const FinanceScreen({Key? key}) : super(key: key);

  @override
  _FinanceScreenState createState() => _FinanceScreenState();
}

class _FinanceScreenState extends State<FinanceScreen> {
  final _txDescController = TextEditingController();
  final _txAmountController = TextEditingController();
  String _txType = 'expense';
  String _txCategory = 'Infrastructure';

  final _invNoController = TextEditingController();
  final _invClientController = TextEditingController();
  final _invClientEmailController = TextEditingController();
  final _invAmountController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final store = Provider.of<BizGenieStore>(context);
    final formatCurrency = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

    double totalIncome = store.transactions
        .where((t) => t.type == 'income')
        .fold(0.0, (sum, t) => sum + t.amount);
    double totalExpense = store.transactions
        .where((t) => t.type == 'expense')
        .fold(0.0, (sum, t) => sum + t.amount);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          Text(
            "FinOps Ledger Suite",
            style: GoogleFonts.spaceGrotesk(
              fontSize: 22.0,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            "Manage your core accounts, cash runways, and client invoices.",
            style: GoogleFonts.inter(fontSize: 12.0, color: const Color(0xFF64748B)),
          ),
          const SizedBox(height: 24.0),

          // Total Ledger Cards
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(16.0),
                    border: Border.all(color: const Color(0xFF1E293B)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.arrow_upward, color: Color(0xFF10B981), size: 18.0),
                      const SizedBox(height: 8.0),
                      Text("Total Invoiced", style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF64748B))),
                      Text(formatCurrency.format(totalIncome), style: GoogleFonts.spaceGrotesk(fontSize: 18.0, fontWeight: FontWeight.bold, color: Colors.white)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(16.0),
                    border: Border.all(color: const Color(0xFF1E293B)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.arrow_downward, color: Color(0xFFEF4444), size: 18.0),
                      const SizedBox(height: 8.0),
                      Text("Total Expenses", style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF64748B))),
                      Text(formatCurrency.format(totalExpense), style: GoogleFonts.spaceGrotesk(fontSize: 18.0, fontWeight: FontWeight.bold, color: Colors.white)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24.0),

          // Budgets Progress Section
          _buildCardFrame(
            title: "Budget Spend Caps",
            icon: Icons.pie_chart_outline,
            action: TextButton.icon(
              onPressed: () => _showAddBudgetDialog(context),
              icon: const Icon(Icons.add, size: 14.0),
              label: Text("Add Cap", style: GoogleFonts.inter(fontSize: 12.0)),
              style: TextButton.styleFrom(foregroundColor: const Color(0xFFA78BFA)),
            ),
            child: ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: store.budgets.length,
              itemBuilder: (context, idx) {
                final b = store.budgets[idx];
                double percent = (b.spent / b.limit).clamp(0.0, 1.0);
                Color barColor = percent > 0.8 ? const Color(0xFFEF4444) : const Color(0xFF7C3AED);

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(b.name, style: GoogleFonts.inter(fontSize: 12.0, color: Colors.white, fontWeight: FontWeight.w600)),
                          Text(
                            "${formatCurrency.format(b.spent)} / ${formatCurrency.format(b.limit)} (${(percent * 100).toStringAsFixed(0)}%)",
                            style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF94A3B8)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6.0),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4.0),
                        child: LinearProgressIndicator(
                          value: percent,
                          backgroundColor: const Color(0xFF1E293B),
                          valueColor: AlwaysStoppedAnimation<Color>(barColor),
                          minHeight: 6.0,
                        ),
                      )
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 24.0),

          // Invoices Tracker Frame
          _buildCardFrame(
            title: "Clients & Invoice Status",
            icon: Icons.receipt_long,
            action: TextButton.icon(
              onPressed: () => _showAddInvoiceDialog(context),
              icon: const Icon(Icons.add, size: 14.0),
              label: Text("New Invoice", style: GoogleFonts.inter(fontSize: 12.0)),
              style: TextButton.styleFrom(foregroundColor: const Color(0xFFA78BFA)),
            ),
            child: ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: store.invoices.length,
              itemBuilder: (context, idx) {
                final inv = store.invoices[idx];
                Color statusColor;
                if (inv.status == 'paid') {
                  statusColor = const Color(0xFF10B981);
                } else if (inv.status == 'pending') {
                  statusColor = const Color(0xFFF59E0B);
                } else {
                  statusColor = const Color(0xFFEF4444);
                }

                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(inv.clientName, style: GoogleFonts.inter(fontSize: 13.0, fontWeight: FontWeight.bold, color: Colors.white)),
                  subtitle: Text("${inv.invoiceNo} • Due ${inv.dueDate}", style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF64748B))),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(formatCurrency.format(inv.amount), style: GoogleFonts.spaceGrotesk(fontSize: 14.0, fontWeight: FontWeight.bold, color: Colors.white)),
                      const SizedBox(width: 8.0),
                      GestureDetector(
                        onTap: () {
                          if (inv.status != 'paid') {
                            store.updateInvoiceStatus(inv.id, 'paid');
                          }
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
                          decoration: BoxDecoration(
                            color: statusColor.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6.0),
                            border: Border.all(color: statusColor.withOpacity(0.4)),
                          ),
                          child: Text(
                            inv.status.toUpperCase(),
                            style: GoogleFonts.spaceGrotesk(fontSize: 9.0, fontWeight: FontWeight.bold, color: statusColor),
                          ),
                        ),
                      )
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 24.0),

          // Transactions Ledger Frame
          _buildCardFrame(
            title: "Ledger Log History",
            icon: Icons.history,
            action: TextButton.icon(
              onPressed: () => _showAddTransactionDialog(context),
              icon: const Icon(Icons.add, size: 14.0),
              label: Text("Add Entry", style: GoogleFonts.inter(fontSize: 12.0)),
              style: TextButton.styleFrom(foregroundColor: const Color(0xFFA78BFA)),
            ),
            child: ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: store.transactions.length,
              itemBuilder: (context, idx) {
                final tx = store.transactions[idx];
                final isIncome = tx.type == 'income';

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10.0),
                        decoration: BoxDecoration(
                          color: isIncome ? const Color(0x1F10B981) : const Color(0x1FEF4444),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          isIncome ? Icons.south_west : Icons.north_east,
                          color: isIncome ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                          size: 14.0,
                        ),
                      ),
                      const SizedBox(width: 12.0),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(tx.description, style: GoogleFonts.inter(fontSize: 12.0, fontWeight: FontWeight.bold, color: Colors.white)),
                            Text("${tx.category} • ${tx.date}", style: GoogleFonts.inter(fontSize: 10.0, color: const Color(0xFF64748B))),
                          ],
                        ),
                      ),
                      Text(
                        "${isIncome ? '+' : '-'}${formatCurrency.format(tx.amount)}",
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 13.0,
                          fontWeight: FontWeight.bold,
                          color: isIncome ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                        ),
                      ),
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

  void _showAddTransactionDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24.0))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text("Add Transaction Entry", style: GoogleFonts.spaceGrotesk(fontSize: 18.0, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 16.0),
                  TextField(
                    controller: _txDescController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(labelText: "Description", labelStyle: TextStyle(color: Color(0xFF64748B))),
                  ),
                  const SizedBox(height: 12.0),
                  TextField(
                    controller: _txAmountController,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(labelText: "Amount (₹)", labelStyle: TextStyle(color: Color(0xFF64748B))),
                  ),
                  const SizedBox(height: 16.0),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ChoiceChip(
                        label: const Text("Expense"),
                        selected: _txType == 'expense',
                        selectedColor: const Color(0xFFEF4444).withOpacity(0.2),
                        labelStyle: TextStyle(color: _txType == 'expense' ? const Color(0xFFEF4444) : Colors.white),
                        onSelected: (selected) {
                          if (selected) setSheetState(() => _txType = 'expense');
                        },
                      ),
                      ChoiceChip(
                        label: const Text("Income"),
                        selected: _txType == 'income',
                        selectedColor: const Color(0xFF10B981).withOpacity(0.2),
                        labelStyle: TextStyle(color: _txType == 'income' ? const Color(0xFF10B981) : Colors.white),
                        onSelected: (selected) {
                          if (selected) setSheetState(() => _txType = 'income');
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 20.0),
                  ElevatedButton(
                    onPressed: () {
                      final store = Provider.of<BizGenieStore>(context, listen: false);
                      store.addTransaction(Transaction(
                        id: "tx-${DateTime.now().millisecondsSinceEpoch}",
                        description: _txDescController.text,
                        amount: double.tryParse(_txAmountController.text) ?? 0.0,
                        type: _txType,
                        category: _txCategory,
                        date: DateTime.now().toIso8601String().split('T')[0],
                      ));
                      _txDescController.clear();
                      _txAmountController.clear();
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF7C3AED)),
                    child: const Text("Submit Ledger Entry"),
                  )
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showAddInvoiceDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24.0))),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text("Create New Invoice", style: GoogleFonts.spaceGrotesk(fontSize: 18.0, fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 16.0),
              TextField(
                controller: _invNoController,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(labelText: "Invoice Number (e.g. INV-2026-004)", labelStyle: TextStyle(color: Color(0xFF64748B))),
              ),
              const SizedBox(height: 12.0),
              TextField(
                controller: _invClientController,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(labelText: "Client Name", labelStyle: TextStyle(color: Color(0xFF64748B))),
              ),
              const SizedBox(height: 12.0),
              TextField(
                controller: _invAmountController,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(labelText: "Amount (₹)", labelStyle: TextStyle(color: Color(0xFF64748B))),
              ),
              const SizedBox(height: 20.0),
              ElevatedButton(
                onPressed: () {
                  final store = Provider.of<BizGenieStore>(context, listen: false);
                  double amt = double.tryParse(_invAmountController.text) ?? 0.0;
                  store.addInvoice(Invoice(
                    id: "inv-${DateTime.now().millisecondsSinceEpoch}",
                    invoiceNo: _invNoController.text,
                    clientName: _invClientController.text,
                    clientEmail: "billing@client.com",
                    amount: amt,
                    issueDate: DateTime.now().toIso8601String().split('T')[0],
                    dueDate: DateTime.now().add(const Duration(days: 14)).toIso8601String().split('T')[0],
                    status: 'pending',
                    items: [InvoiceItem(description: "Consulting Operations", quantity: 1, unitPrice: amt, amount: amt)],
                  ));
                  _invNoController.clear();
                  _invClientController.clear();
                  _invAmountController.clear();
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF7C3AED)),
                child: const Text("Generate Bill"),
              )
            ],
          ),
        );
      },
    );
  }

  void _showAddBudgetDialog(BuildContext context) {
    // Standard quick dialog
    final nameCont = TextEditingController();
    final limitCont = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF0F172A),
          title: Text("Create Budget Cap", style: GoogleFonts.spaceGrotesk(color: Colors.white)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameCont,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(labelText: "Budget Name", labelStyle: TextStyle(color: Color(0xFF64748B))),
              ),
              TextField(
                controller: limitCont,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(labelText: "Cap Limit (₹)", labelStyle: TextStyle(color: Color(0xFF64748B))),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                final store = Provider.of<BizGenieStore>(context, listen: false);
                store.addBudget(Budget(
                  id: "b-${DateTime.now().millisecondsSinceEpoch}",
                  name: nameCont.text,
                  limit: double.tryParse(limitCont.text) ?? 1000.0,
                  spent: 0.0,
                  category: "Infrastructure",
                  period: "monthly",
                ));
                Navigator.pop(context);
              },
              child: const Text("Add"),
            ),
          ],
        );
      },
    );
  }
}
