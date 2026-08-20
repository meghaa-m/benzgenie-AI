import 'package:flutter/material';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/store.dart';
import '../models/types.dart';

class ProfileScreen extends StatefulWidget {
  final VoidCallback onResetOnboarding;

  const ProfileScreen({Key? key, required this.onResetOnboarding}) : super(key: key);

  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _companyController = TextEditingController();
  final _industryController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final store = Provider.of<BizGenieStore>(context, listen: false);
    _nameController.text = store.profile.name;
    _emailController.text = store.profile.email;
    _companyController.text = store.profile.companyName;
    _industryController.text = store.profile.industry;
  }

  @override
  Widget build(BuildContext context) {
    final store = Provider.of<BizGenieStore>(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          Text(
            "Account Settings & Profile",
            style: GoogleFonts.spaceGrotesk(
              fontSize: 22.0,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            "Control operational defaults, toggle alerts, and configure your SaaS tiers.",
            style: GoogleFonts.inter(fontSize: 12.0, color: const Color(0xFF64748B)),
          ),
          const SizedBox(height: 24.0),

          // Details Forms
          _buildCardFrame(
            title: "Identity & Company Profile",
            icon: Icons.person_outline,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildField("Account Owner Name", _nameController),
                const SizedBox(height: 12.0),
                _buildField("Primary Contact Email", _emailController),
                const SizedBox(height: 12.0),
                _buildField("Registered Company Name", _companyController),
                const SizedBox(height: 12.0),
                _buildField("Industry Segment", _industryController),
                const SizedBox(height: 20.0),
                ElevatedButton(
                  onPressed: _saveProfileChanges,
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF7C3AED)),
                  child: Text("Save Settings Profile", style: GoogleFonts.spaceGrotesk(fontSize: 13.0, fontWeight: FontWeight.bold)),
                )
              ],
            ),
          ),
          const SizedBox(height: 24.0),

          // Toggles Preferences
          _buildCardFrame(
            title: "Operational Toggles",
            icon: Icons.toggle_on_outlined,
            child: Column(
              children: [
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text("Enable Real-time Alerts", style: GoogleFonts.inter(fontSize: 13.0, fontWeight: FontWeight.bold, color: Colors.white)),
                  subtitle: Text("Notify on uncollected bills & invoice spikes.", style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF64748B))),
                  value: store.profile.notificationsEnabled,
                  activeColor: const Color(0xFF7C3AED),
                  onChanged: (val) {
                    final p = store.profile;
                    store.updateProfile(UserProfile(
                      name: p.name,
                      email: p.email,
                      companyName: p.companyName,
                      industry: p.industry,
                      subscription: p.subscription,
                      notificationsEnabled: val,
                      voiceEnabled: p.voiceEnabled,
                      theme: p.theme,
                    ));
                  },
                ),
                const Divider(color: Color(0xFF1E293B)),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text("Voice Synth Guidance", style: GoogleFonts.inter(fontSize: 13.0, fontWeight: FontWeight.bold, color: Colors.white)),
                  subtitle: Text("Use synthesized speech for copilot strategic briefs.", style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF64748B))),
                  value: store.profile.voiceEnabled,
                  activeColor: const Color(0xFF7C3AED),
                  onChanged: (val) {
                    final p = store.profile;
                    store.updateProfile(UserProfile(
                      name: p.name,
                      email: p.email,
                      companyName: p.companyName,
                      industry: p.industry,
                      subscription: p.subscription,
                      notificationsEnabled: p.notificationsEnabled,
                      voiceEnabled: val,
                      theme: p.theme,
                    ));
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24.0),

          // Storage purge
          _buildCardFrame(
            title: "Developer Utilities",
            icon: Icons.construction,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  "Warning: Resetting onboarding will erase all custom transactions, scheduled copy scripts, and company overrides from the local database.",
                  style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF94A3B8), height: 1.4),
                ),
                const SizedBox(height: 16.0),
                OutlinedButton(
                  onPressed: () {
                    store.clearOnboarding();
                    widget.onResetOnboarding();
                  },
                  style: OutlinedButton.styleFrom(side: const BorderSide(color: Colors.roseColor)),
                  child: Text("Purge & Re-run Onboarding Flow", style: GoogleFonts.spaceGrotesk(fontSize: 12.0, color: Colors.roseColor, fontWeight: FontWeight.bold)),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildField(String label, TextEditingController controller) {
    return TextField(
      controller: controller,
      style: GoogleFonts.inter(color: Colors.white, fontSize: 13.0),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Color(0xFF64748B)),
        filled: true,
        fillColor: const Color(0xFF020617),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10.0),
          borderSide: const BorderSide(color: Color(0xFF1E293B)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10.0),
          borderSide: const BorderSide(color: Color(0xFF7C3AED)),
        ),
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

  void _saveProfileChanges() {
    final store = Provider.of<BizGenieStore>(context, listen: false);
    final p = store.profile;

    store.updateProfile(UserProfile(
      name: _nameController.text.trim(),
      email: _emailController.text.trim(),
      companyName: _companyController.text.trim(),
      industry: _industryController.text.trim(),
      subscription: p.subscription,
      notificationsEnabled: p.notificationsEnabled,
      voiceEnabled: p.voiceEnabled,
      theme: p.theme,
    ));

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Profile settings successfully committed!")),
    );
  }
}

extension on Colors {
  static const Color roseColor = Color(0xFFF43F5E);
}
