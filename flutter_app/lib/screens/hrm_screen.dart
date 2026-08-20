import 'package:flutter/material';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../services/store.dart';
import '../models/types.dart';

class HRMScreen extends StatefulWidget {
  const HRMScreen({Key? key}) : super(key: key);

  @override
  _HRMScreenState createState() => _HRMScreenState();
}

class _HRMScreenState extends State<HRMScreen> {
  final _empNameController = TextEditingController();
  final _empRoleController = TextEditingController();
  final _empSalaryController = TextEditingController();
  String _empDept = 'Engineering';

  bool _isScreening = false;
  String? _screeningCandidateName;
  String? _screeningRole;
  Map<String, dynamic>? _screeningResult;

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
          Text(
            "HRM & Resume Screener",
            style: GoogleFonts.spaceGrotesk(
              fontSize: 22.0,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            "Manage core employees, schedule leaves, and run resume match analysis.",
            style: GoogleFonts.inter(fontSize: 12.0, color: const Color(0xFF64748B)),
          ),
          const SizedBox(height: 24.0),

          // Match Screening simulator
          Container(
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
              ),
              borderRadius: BorderRadius.circular(20.0),
              border: Border.all(color: const Color(0xFF334155)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    const Icon(Icons.psychology, color: Color(0xFFC084FC), size: 20.0),
                    const SizedBox(width: 8.0),
                    Text(
                      "Resume Match Analysis Engine",
                      style: GoogleFonts.spaceGrotesk(fontSize: 14.0, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ],
                ),
                const SizedBox(height: 12.0),
                Text(
                  "Upload a simulated profile to screen for alignment scores, skills gaps, and key interview questions.",
                  style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF94A3B8), height: 1.4),
                ),
                const Divider(color: Color(0xFF334155), height: 24.0),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E293B),
                        foregroundColor: Colors.white,
                      ) == null
                          ? Container()
                          : ActionChip(
                              backgroundColor: const Color(0xFF1E293B),
                              side: const BorderSide(color: Color(0xFF334155)),
                              label: Text("Screen Candidate: John Doe (Senior PM)", style: GoogleFonts.inter(color: Colors.white, fontSize: 11.0)),
                              onPressed: () => _simulateScreening("John Doe", "Technical Product Manager"),
                            ),
                    ),
                    const SizedBox(width: 8.0),
                    Expanded(
                      child: ActionChip(
                        backgroundColor: const Color(0xFF1E293B),
                        side: const BorderSide(color: Color(0xFF334155)),
                        label: Text("Screen Candidate: Clara Jenkins (ML Dev)", style: GoogleFonts.inter(color: Colors.white, fontSize: 11.0)),
                        onPressed: () => _simulateScreening("Clara Jenkins", "Machine Learning Engineer"),
                      ),
                    ),
                  ],
                ),
                if (_isScreening) ...[
                  const SizedBox(height: 16.0),
                  const LinearProgressIndicator(color: Color(0xFF7C3AED), backgroundColor: Color(0xFF020617)),
                ],
                if (_screeningResult != null) ...[
                  const SizedBox(height: 20.0),
                  Container(
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFF020617),
                      borderRadius: BorderRadius.circular(12.0),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _screeningCandidateName!,
                              style: GoogleFonts.spaceGrotesk(fontSize: 15.0, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
                              decoration: BoxDecoration(
                                color: const Color(0xFF10B981).withOpacity(0.15),
                                borderRadius: BorderRadius.circular(8.0),
                              ),
                              child: Text(
                                "Match Score: ${_screeningResult!['score']}%",
                                style: GoogleFonts.spaceGrotesk(fontSize: 11.0, fontWeight: FontWeight.bold, color: const Color(0xFF10B981)),
                              ),
                            )
                          ],
                        ),
                        Text("Target Role: $_screeningRole", style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF64748B))),
                        const SizedBox(height: 12.0),
                        _buildBulletBlock("Identified Core Skills", _screeningResult!['skills']),
                        const SizedBox(height: 8.0),
                        _buildBulletBlock("SaaS Strengths", _screeningResult!['strengths']),
                        const SizedBox(height: 8.0),
                        _buildBulletBlock("Weaknesses / Gaps", _screeningResult!['weaknesses']),
                        const SizedBox(height: 12.0),
                        Text(
                          "Custom Interview Screener Questions:",
                          style: GoogleFonts.inter(fontSize: 12.0, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        const SizedBox(height: 4.0),
                        ...(_screeningResult!['questions'] as List<String>).map((q) => Padding(
                          padding: const EdgeInsets.only(bottom: 6.0),
                          child: Text(
                            "• \"$q\"",
                            style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF94A3B8), fontStyle: FontStyle.italic),
                          ),
                        )).toList(),
                      ],
                    ),
                  )
                ]
              ],
            ),
          ),
          const SizedBox(height: 24.0),

          // Employees Frame list
          _buildCardFrame(
            title: "Zenith Core Team Roster",
            icon: Icons.badge_outlined,
            action: TextButton.icon(
              onPressed: () => _showAddEmployeeSheet(context),
              icon: const Icon(Icons.add, size: 14.0),
              label: Text("Hire Member", style: GoogleFonts.inter(fontSize: 12.0)),
              style: TextButton.styleFrom(foregroundColor: const Color(0xFFA78BFA)),
            ),
            child: ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: store.employees.length,
              separatorBuilder: (context, idx) => const Divider(color: Color(0xFF1E293B)),
              itemBuilder: (context, idx) {
                final emp = store.employees[idx];

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(emp.name, style: GoogleFonts.inter(fontSize: 13.0, fontWeight: FontWeight.bold, color: Colors.white)),
                            Text("${emp.role} • ${emp.department}", style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF64748B))),
                            const SizedBox(height: 4.0),
                            Text(
                              "Salary: ${formatCurrency.format(emp.salary)}/yr  |  Attendance: ${emp.attendanceRate}%  |  Leaves Remaining: ${emp.leaveRemaining} days",
                              style: GoogleFonts.inter(fontSize: 10.0, color: const Color(0xFF94A3B8)),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete, color: Colors.roseColor, size: 16.0),
                        onPressed: () => _terminateEmployee(store, emp),
                      )
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

  Widget _buildBulletBlock(String title, String items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "$title:",
          style: GoogleFonts.inter(fontSize: 11.0, fontWeight: FontWeight.bold, color: const Color(0xFF818CF8)),
        ),
        Text(
          items,
          style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF94A3B8)),
        ),
      ],
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

  void _simulateScreening(String name, String role) {
    setState(() {
      _isScreening = true;
      _screeningCandidateName = name;
      _screeningRole = role;
      _screeningResult = null;
    });

    Future.delayed(const Duration(seconds: 1), () {
      Map<String, dynamic> mockOutput = {};

      if (role.contains("Manager")) {
        mockOutput = {
          'score': 92,
          'skills': "Agile, SaaS Architecture, JIRA, Client Sign-off, Gantt Models",
          'strengths': "Met deliverables with Marcus Sterling. Solid multi-tenant CRM lifecycle literacy.",
          'weaknesses': "Cloud billing strategy familiarity is light.",
          'questions': [
            "How do you resolve capacity conflicts between ML researchers and front-end developers?",
            "Can you walk us through how you manage payment latencies with enterprise agencies?"
          ]
        };
      } else {
        mockOutput = {
          'score': 87,
          'skills': "PyTorch, CUDA cores, Docker, Vector search optimization, Caching nodes",
          'strengths': "High proficiency tuning LLMs offline and configuring model endpoints.",
          'weaknesses': "Client-facing consult experience is standard.",
          'questions': [
            "How do you design fallbacks for offline models in high-concurrency client settings?",
            "What techniques do you use to prune non-performing neural network nodes?"
          ]
        };
      }

      setState(() {
        _screeningResult = mockOutput;
        _isScreening = false;
      });
    });
  }

  void _terminateEmployee(BizGenieStore store, Employee emp) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF0F172A),
          title: Text("Confirm Team Member Deletion", style: GoogleFonts.spaceGrotesk(color: Colors.white)),
          content: Text("Are you sure you want to delete ${emp.name} from Zenith Tech Solutions core roster?", style: GoogleFonts.inter(color: const Color(0xFF94A3B8))),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                store.deleteEmployee(emp.id);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(backgroundColor: Colors.roseColor),
              child: const Text("Remove"),
            ),
          ],
        );
      },
    );
  }

  void _showAddEmployeeSheet(BuildContext context) {
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
                  Text("Roster Addition Entry", style: GoogleFonts.spaceGrotesk(fontSize: 18.0, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 16.0),
                  TextField(
                    controller: _empNameController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(labelText: "Full Name", labelStyle: TextStyle(color: Color(0xFF64748B))),
                  ),
                  const SizedBox(height: 12.0),
                  TextField(
                    controller: _empRoleController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(labelText: "Hired Title (e.g. ML Engineer)", labelStyle: TextStyle(color: Color(0xFF64748B))),
                  ),
                  const SizedBox(height: 12.0),
                  TextField(
                    controller: _empSalaryController,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(labelText: "Annual Base Salary (₹)", labelStyle: TextStyle(color: Color(0xFF64748B))),
                  ),
                  const SizedBox(height: 16.0),
                  DropdownButtonFormField<String>(
                    value: _empDept,
                    dropdownColor: const Color(0xFF0F172A),
                    style: GoogleFonts.inter(color: Colors.white, fontSize: 13.0),
                    decoration: const InputDecoration(labelText: "Operating Department"),
                    items: const [
                      DropdownMenuItem(value: 'Engineering', child: Text("Engineering")),
                      DropdownMenuItem(value: 'Marketing', child: Text("Marketing")),
                      DropdownMenuItem(value: 'Product', child: Text("Product")),
                      DropdownMenuItem(value: 'Operations', child: Text("Operations")),
                    ],
                    onChanged: (val) {
                      if (val != null) setSheetState(() => _empDept = val);
                    },
                  ),
                  const SizedBox(height: 24.0),
                  ElevatedButton(
                    onPressed: () {
                      final store = Provider.of<BizGenieStore>(context, listen: false);
                      store.addEmployee(Employee(
                        id: "emp-${DateTime.now().millisecondsSinceEpoch}",
                        name: _empNameController.text.trim(),
                        role: _empRoleController.text.trim(),
                        department: _empDept,
                        email: "${_empNameController.text.toLowerCase().replaceAll(' ', '.')}@zenithtech.io",
                        salary: double.tryParse(_empSalaryController.text) ?? 60000.0,
                        attendanceRate: 100.0,
                        leaveRemaining: 15,
                        joinDate: DateTime.now().toIso8601String().split('T')[0],
                      ));
                      _empNameController.clear();
                      _empRoleController.clear();
                      _empSalaryController.clear();
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF7C3AED)),
                    child: const Text("Issue Contract Offer"),
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

extension on Colors {
  static const Color roseColor = Color(0xFFF43F5E);
}
