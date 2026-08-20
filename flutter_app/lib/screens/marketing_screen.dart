import 'package:flutter/material';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter/services.dart';
import '../services/store.dart';
import '../models/types.dart';

class MarketingScreen extends StatefulWidget {
  const MarketingScreen({Key? key}) : super(key: key);

  @override
  _MarketingScreenState createState() => _MarketingScreenState();
}

class _MarketingScreenState extends State<MarketingScreen> {
  final _topicController = TextEditingController(text: "SaaS Multi-tenant DB architectures");
  String _platform = 'linkedin';
  String _tone = 'Professional & Tech-oriented';
  bool _isGenerating = false;
  String? _generatedResult;

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
            "AI Marketing Copywriter",
            style: GoogleFonts.spaceGrotesk(
              fontSize: 22.0,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            "Instantly craft engaging, custom campaign captions and professional threads.",
            style: GoogleFonts.inter(fontSize: 12.0, color: const Color(0xFF64748B)),
          ),
          const SizedBox(height: 24.0),

          // Generator form inputs
          Container(
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(20.0),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  "Crafting Station",
                  style: GoogleFonts.spaceGrotesk(fontSize: 15.0, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const Divider(color: Color(0xFF1E293B), height: 24.0),

                // Platform Dropdown
                _buildLabel("TARGET PLATFORM"),
                const SizedBox(height: 6.0),
                DropdownButtonFormField<String>(
                  value: _platform,
                  dropdownColor: const Color(0xFF0F172A),
                  style: GoogleFonts.inter(color: Colors.white, fontSize: 13.0),
                  decoration: _inputDecoration(),
                  items: const [
                    DropdownMenuItem(value: 'linkedin', child: Text("LinkedIn Professional")),
                    DropdownMenuItem(value: 'instagram', child: Text("Instagram Lifestyle")),
                    DropdownMenuItem(value: 'facebook', child: Text("Facebook Brand Page")),
                    DropdownMenuItem(value: 'email', child: Text("Cold Sales Email")),
                  ],
                  onChanged: (val) {
                    if (val != null) setState(() => _platform = val);
                  },
                ),
                const SizedBox(height: 16.0),

                // Topic Field
                _buildLabel("CAMPAIGN TOPIC"),
                const SizedBox(height: 6.0),
                TextField(
                  controller: _topicController,
                  style: GoogleFonts.inter(color: Colors.white, fontSize: 13.0),
                  decoration: _inputDecoration(hint: "What are you promoting or discussing?"),
                ),
                const SizedBox(height: 16.0),

                // Tone drop list
                _buildLabel("BRAND TONE"),
                const SizedBox(height: 6.0),
                DropdownButtonFormField<String>(
                  value: _tone,
                  dropdownColor: const Color(0xFF0F172A),
                  style: GoogleFonts.inter(color: Colors.white, fontSize: 13.0),
                  decoration: _inputDecoration(),
                  items: const [
                    DropdownMenuItem(value: 'Professional & Tech-oriented', child: Text("Professional & Tech-oriented")),
                    DropdownMenuItem(value: 'Empathetic & Warm', child: Text("Empathetic & Warm")),
                    DropdownMenuItem(value: 'Direct Cold Sales', child: Text("Direct Cold Sales")),
                    DropdownMenuItem(value: 'Casual, Playful & Hype', child: Text("Casual, Playful & Hype")),
                  ],
                  onChanged: (val) {
                    if (val != null) setState(() => _tone = val);
                  },
                ),
                const SizedBox(height: 24.0),

                // Generate trigger Button
                ElevatedButton(
                  onPressed: _isGenerating ? null : _generateCopy,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF7C3AED),
                    padding: const EdgeInsets.symmetric(vertical: 14.0),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                  ),
                  child: _isGenerating
                      ? const SizedBox(
                          width: 20.0,
                          height: 20.0,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : Text(
                          "Synthesize Social Copy",
                          style: GoogleFonts.spaceGrotesk(fontSize: 14.0, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                )
              ],
            ),
          ),
          const SizedBox(height: 24.0),

          // Output Result Box
          if (_generatedResult != null)
            Container(
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0x1F7C3AED), Color(0x0F7C3AED)],
                ),
                borderRadius: BorderRadius.circular(20.0),
                border: Border.all(color: const Color(0x407C3AED)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Generated Copy Draft",
                        style: GoogleFonts.spaceGrotesk(fontSize: 14.0, fontWeight: FontWeight.bold, color: const Color(0xFFA78BFA)),
                      ),
                      IconButton(
                        icon: const Icon(Icons.copy, color: Color(0xFFA78BFA), size: 18.0),
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: _generatedResult!));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text("Copied draft to clipboard!")),
                          );
                        },
                      )
                    ],
                  ),
                  const SizedBox(height: 12.0),
                  Text(
                    _generatedResult!,
                    style: GoogleFonts.inter(fontSize: 13.0, color: Colors.white, height: 1.5),
                  ),
                  const SizedBox(height: 16.0),
                  ElevatedButton(
                    onPressed: () {
                      store.addMarketingPost(MarketingPost(
                        id: "post-${DateTime.now().millisecondsSinceEpoch}",
                        platform: _platform,
                        topic: _topicController.text,
                        content: _generatedResult!,
                        date: DateTime.now().toIso8601String().split('T')[0],
                        status: 'scheduled',
                      ));
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Draft saved in campaign roster!")),
                      );
                      setState(() {
                        _generatedResult = null;
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      elevation: 0,
                      side: const BorderSide(color: Color(0xFF7C3AED)),
                    ),
                    child: Text("Schedule & Add to Campaign Roster", style: TextStyle(color: const Color(0xFFA78BFA))),
                  )
                ],
              ),
            ),
          const SizedBox(height: 24.0),

          // Campaigns Board
          if (store.marketingPosts.isNotEmpty)
            _buildCardFrame(
              title: "Active Campaigns & Scheduled Posts",
              icon: Icons.newspaper,
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: store.marketingPosts.length,
                separatorBuilder: (context, idx) => const Divider(color: Color(0xFF1E293B), height: 24.0),
                itemBuilder: (context, idx) {
                  final post = store.marketingPosts[idx];

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(
                                post.platform == 'linkedin'
                                    ? Icons.business_center
                                    : post.platform == 'instagram'
                                        ? Icons.camera_alt
                                        : Icons.mail_outline,
                                color: const Color(0xFFA78BFA),
                                size: 14.0,
                              ),
                              const SizedBox(width: 8.0),
                              Text(
                                "Platform: ${post.platform.toUpperCase()}",
                                style: GoogleFonts.spaceGrotesk(fontSize: 11.0, fontWeight: FontWeight.bold, color: const Color(0xFF94A3B8)),
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              Text(post.date, style: GoogleFonts.inter(fontSize: 10.0, color: const Color(0xFF64748B))),
                              const SizedBox(width: 8.0),
                              IconButton(
                                icon: const Icon(Icons.delete_outline, color: Colors.roseColor, size: 16.0),
                                onPressed: () => store.deleteMarketingPost(post.id),
                              )
                            ],
                          )
                        ],
                      ),
                      const SizedBox(height: 6.0),
                      Text(
                        post.content,
                        style: GoogleFonts.inter(fontSize: 12.0, color: const Color(0xFFE2E8F0), height: 1.4),
                        maxLines: 4,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  );
                },
              ),
            )
        ],
      ),
    );
  }

  Widget _buildLabel(String label) {
    return Text(
      label,
      style: GoogleFonts.spaceGrotesk(fontSize: 10.0, fontWeight: FontWeight.bold, color: const Color(0xFF64748B), letterSpacing: 0.5),
    );
  }

  InputDecoration _inputDecoration({String? hint}) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Color(0xFF475569)),
      filled: true,
      fillColor: const Color(0xFF020617),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10.0),
        borderSide: const BorderSide(color: Color(0xFF1E293B)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10.0),
        borderSide: const BorderSide(color: Color(0xFF7C3AED)),
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

  void _generateCopy() {
    setState(() {
      _isGenerating = true;
    });

    Future.delayed(const Duration(seconds: 1), () {
      String promptTopic = _topicController.text;
      String result = "";

      if (_platform == 'linkedin') {
        result = "🚀 Let's talk about: $promptTopic!\n\n"
            "Scaling enterprise architecture requires more than just piling on microservices. "
            "At Zenith Tech Solutions, we realized early on that system longevity is directly correlated with caching hygiene and multi-tenant database partitioning.\n\n"
            "Key operational priorities:\n"
            "• Minimize DB IOPS limits via local cache proxies.\n"
            "• Configure spot-instance autoscalers for stateless workers.\n"
            "• Monitor billing thresholds to prevent Cloud runaway.\n\n"
            "Are you building on AWS or GCP? Let's discuss in the comments below!\n\n"
            "#TechLeadership #SaaSArchitecture #CloudOptimization #SoftwareEngineering";
      } else if (_platform == 'instagram') {
        result = "💡 System Engineering Insights: $promptTopic ✨\n\n"
            "Who says SaaS architecture can't look elegant? 💻 Swipe left to see how we optimized our latest client custom Generative AI pipeline and slashed latency by 45%.\n\n"
            "🔥 Tip of the day: Stop scaling out until you have optimized your DB indexing. It saves cloud bills and preserves sanity!\n\n"
            "Let us know your favorite SaaS stack in the comments! 👇\n\n"
            "#SaaSStartup #TechMindset #ZenithTech #DeveloperMotivation #MinimalistDesign";
      } else if (_platform == 'email') {
        result = "Subject: Actionable scalability report for Zenith Tech Solutions\n\n"
            "Hi [Name],\n\n"
            "I noticed you're currently navigating high transaction growth with your $promptTopic stack.\n\n"
            "Typically, when client platforms expand, database connection fatigue acts as a hidden tax on response latency. At Zenith Tech, we engineered custom prompt orchestration layers that cut operational cost overheads by ~30%.\n\n"
            "I'd love to share our 3-point scalability roadmap tailored to your specific system stack. Do you have 10 minutes next Tuesday at 2 PM?\n\n"
            "Best,\n"
            "Meghaa Raj\n"
            "Zenith Tech Solutions";
      } else {
        result = "🔥 Hot Take on $promptTopic!\n\n"
            "Optimizing modern business flows shouldn't take full engineering months. By utilizing automated copilot setups, our teams can focus on strategic enterprise sales rather than maintaining plumbing.\n\n"
            "Join our newsletter list today to receive weekly optimization guides!";
      }

      setState(() {
        _generatedResult = result;
        _isGenerating = false;
      });
    });
  }
}

extension on Colors {
  static const Color roseColor = Color(0xFFF43F5E);
}
