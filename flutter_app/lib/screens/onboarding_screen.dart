import 'package:flutter/material';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/store.dart';
import '../models/types.dart';

class OnboardingScreen extends StatefulWidget {
  final VoidCallback onComplete;

  const OnboardingScreen({Key? key, required this.onComplete}) : super(key: key);

  @override
  _OnboardingScreenState createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController(text: "Meghaa Raj");
  final _companyController = TextEditingController(text: "Zenith Tech Solutions");
  final _emailController = TextEditingController(text: "meghaaraj7882@gmail.com");
  String _industry = "AI & Software Services";
  String _subscription = "Pro Genie";

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFF020617), // slate-950
      body: Stack(
        children: [
          // Ambient Glow
          Positioned(
            top: -100,
            right: -50,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0x1A7C3AED), // 10% opacity violet-600
                blurRadius: 100,
              ),
            ),
          ),
          Positioned(
            bottom: -50,
            left: -50,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0x12D946EF), // 7% opacity fuchsia-500
                blurRadius: 80,
              ),
            ),
          ),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Genie Icon/Sparkle
                      Center(
                        child: Container(
                          padding: const EdgeInsets.all(16.0),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF7C3AED), Color(0xFFD946EF)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(24.0),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0x407C3AED),
                                offset: const Offset(0, 10),
                                blurRadius: 20,
                              )
                            ],
                          ),
                          child: const Icon(
                            Icons.auto_awesome,
                            color: Colors.white,
                            size: 40.0,
                          ),
                        ),
                      ),
                      const SizedBox(height: 24.0),
                      Text(
                        "BIZGENIE AI",
                        textAlign: TextAlign.center,
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 32.0,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -0.5,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8.0),
                      Text(
                        "Your Intelligent Business Companion",
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(
                          fontSize: 14.0,
                          color: const Color(0xFF94A3B8), // slate-400
                        ),
                      ),
                      const SizedBox(height: 32.0),
                      // Card Wrapper
                      Container(
                        padding: const EdgeInsets.all(24.0),
                        decoration: BoxDecoration(
                          color: const Color(0x1F1E293B), // slate-900 with some transparency
                          borderRadius: BorderRadius.circular(24.0),
                          border: Border.all(color: const Color(0x1F334155)), // slate-800
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            _buildSectionTitle("Personal Information"),
                            const SizedBox(height: 16.0),
                            _buildTextField("Your Name", _nameController, Icons.person),
                            const SizedBox(height: 16.0),
                            _buildTextField("Email Address", _emailController, Icons.email, keyboardType: TextInputType.emailAddress),
                            const SizedBox(height: 24.0),
                            _buildSectionTitle("Business Information"),
                            const SizedBox(height: 16.0),
                            _buildTextField("Company Name", _companyController, Icons.business),
                            const SizedBox(height: 16.0),
                            _buildDropdownField(
                              "Industry Sector",
                              _industry,
                              ["AI & Software Services", "Retail & E-commerce", "Consulting & Agency", "Healthcare & Medical", "Finance & Fintech"],
                              (val) {
                                if (val != null) setState(() => _industry = val);
                              },
                            ),
                            const SizedBox(height: 16.0),
                            _buildDropdownField(
                              "SaaS Subscription Plan",
                              _subscription,
                              ["Free", "Pro Genie", "Enterprise"],
                              (val) {
                                if (val != null) setState(() => _subscription = val);
                              },
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24.0),
                      // Submit Button
                      ElevatedButton(
                        onPressed: _submitOnboarding,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16.0),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16.0),
                          ),
                          backgroundColor: Colors.transparent,
                          foregroundColor: Colors.white,
                          shadowColor: const Color(0x407C3AED),
                          elevation: 8,
                        ).copyWith(
                          backgroundColor: MaterialStateProperty.all(Colors.transparent),
                        ),
                        child: Ink(
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF7C3AED), Color(0xFFD946EF)],
                            ),
                            borderRadius: BorderRadius.circular(16.0),
                          ),
                          child: Container(
                            alignment: Alignment.center,
                            constraints: const BoxConstraints(minHeight: 52),
                            child: Text(
                              "Summon Your Genie",
                              style: GoogleFonts.inter(
                                fontSize: 16.0,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: GoogleFonts.spaceGrotesk(
        fontSize: 16.0,
        fontWeight: FontWeight.bold,
        color: const Color(0xFFA78BFA), // violet-400
        letterSpacing: 0.5,
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, {TextInputType keyboardType = TextInputType.text}) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      style: GoogleFonts.inter(color: Colors.white, fontSize: 14.0),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Color(0xFF64748B)), // slate-500
        prefixIcon: Icon(icon, color: const Color(0xFF818CF8), size: 20.0), // indigo-400
        filled: true,
        fillColor: const Color(0xFF0F172A), // slate-900
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: Color(0xFF1E293B)), // slate-800
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: Color(0xFF7C3AED)), // violet-600
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: Colors.roseColor),
        ),
      ),
      validator: (value) {
        if (value == null || value.trim().isEmpty) {
          return 'This field is required';
        }
        return null;
      },
    );
  }

  Widget _buildDropdownField(String label, String value, List<String> items, ValueChanged<String?> onChanged) {
    return DropdownButtonFormField<String>(
      value: value,
      dropdownColor: const Color(0xFF0F172A),
      style: GoogleFonts.inter(color: Colors.white, fontSize: 14.0),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Color(0xFF64748B)),
        filled: true,
        fillColor: const Color(0xFF0F172A),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: Color(0xFF1E293B)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: Color(0xFF7C3AED)),
        ),
      ),
      items: items.map((String val) {
        return DropdownMenuItem<String>(
          value: val,
          child: Text(val),
        );
      }).toList(),
      onChanged: onChanged,
    );
  }

  void _submitOnboarding() {
    if (_formKey.currentState!.validate()) {
      final store = Provider.of<BizGenieStore>(context, listen: false);
      store.updateProfile(UserProfile(
        name: _nameController.text.trim(),
        email: _emailController.text.trim(),
        companyName: _companyController.text.trim(),
        industry: _industry,
        subscription: _subscription,
        notificationsEnabled: true,
        voiceEnabled: true,
        theme: "dark",
      ));
      store.setOnboardingCompleted();
      widget.onComplete();
    }
  }
}

// Minimal placeholder extension for Rose Color
extension on Colors {
  static const Color roseColor = Color(0xFFF43F5E);
}
