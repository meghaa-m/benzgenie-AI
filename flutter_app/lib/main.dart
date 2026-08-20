import 'package:flutter/material';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/store.dart';
import 'screens/onboarding_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/assistant_screen.dart';
import 'screens/finance_screen.dart';
import 'screens/crm_screen.dart';
import 'screens/marketing_screen.dart';
import 'screens/hrm_screen.dart';
import 'screens/documents_screen.dart';
import 'screens/analytics_screen.dart';
import 'screens/profile_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    ChangeNotifierProvider(
      create: (_) => BizGenieStore(),
      child: const BizGenieApp(),
    ),
  );
}

class BizGenieApp extends StatelessWidget {
  const BizGenieApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BizGenie AI',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF020617), // slate-950
        primaryColor: const Color(0xFF7C3AED), // violet-600
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF7C3AED),
          secondary: Color(0xFFD946EF),
          background: Color(0xFF020617),
          surface: Color(0xFF0F172A),
        ),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF0F172A),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12.0),
            borderSide: const BorderSide(color: Color(0xFF1E293B)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12.0),
            borderSide: const BorderSide(color: Color(0xFF1E293B)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12.0),
            borderSide: const BorderSide(color: Color(0xFF7C3AED)),
          ),
        ),
      ),
      home: const MainAppController(),
    );
  }
}

class MainAppController extends StatefulWidget {
  const MainAppController({Key? key}) : super(key: key);

  @override
  _MainAppControllerState createState() => _MainAppControllerState();
}

class _MainAppControllerState extends State<MainAppController> {
  int _currentTabIndex = 0;
  String? _pendingQuickPrompt;

  // Track sub-screen within 'More Hub'
  String? _activeMoreScreenId;

  void _onNavigateTo(String screenId, {String? quickPrompt}) {
    if (quickPrompt != null) {
      _pendingQuickPrompt = quickPrompt;
    }
    
    // Check if the screen is a main tab or inside 'More'
    if (screenId == 'dashboard') {
      setState(() {
        _currentTabIndex = 0;
        _activeMoreScreenId = null;
      });
    } else if (screenId == 'assistant') {
      setState(() {
        _currentTabIndex = 1;
        _activeMoreScreenId = null;
      });
    } else if (screenId == 'finance') {
      setState(() {
        _currentTabIndex = 2;
        _activeMoreScreenId = null;
      });
    } else if (screenId == 'crm') {
      setState(() {
        _currentTabIndex = 3;
        _activeMoreScreenId = null;
      });
    } else {
      // It's in 'More Hub'
      setState(() {
        _currentTabIndex = 4;
        _activeMoreScreenId = screenId;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final store = Provider.of<BizGenieStore>(context);

    if (!store.isInitialized) {
      return const Scaffold(
        backgroundColor: Color(0xFF020617),
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFF7C3AED)),
        ),
      );
    }

    // Direct to Onboarding screen if not completed
    if (!store.isOnboardingDone()) {
      return OnboardingScreen(
        onComplete: () {
          setState(() {});
        },
      );
    }

    // Render appropriate screen
    Widget bodyWidget;
    switch (_currentTabIndex) {
      case 0:
        bodyWidget = DashboardScreen(onNavigate: _onNavigateTo);
        break;
      case 1:
        String? pr = _pendingQuickPrompt;
        _pendingQuickPrompt = null; // consume
        bodyWidget = AssistantScreen(initialPrompt: pr);
        break;
      case 2:
        bodyWidget = const FinanceScreen();
        break;
      case 3:
        bodyWidget = const CRMScreen();
        break;
      case 4:
        bodyWidget = _buildMoreHub();
        break;
      default:
        bodyWidget = DashboardScreen(onNavigate: _onNavigateTo);
    }

    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: _currentTabIndex != 1 // Chat assistant has its own AppBar
          ? AppBar(
              backgroundColor: const Color(0xFF0F172A),
              elevation: 0,
              title: Row(
                children: [
                  const Icon(Icons.auto_awesome, color: Color(0xFFA78BFA), size: 20.0),
                  const SizedBox(width: 8.0),
                  Text(
                    "BizGenie AI",
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 16.0,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: -0.5,
                    ),
                  ),
                ],
              ),
              centerTitle: false,
              actions: [
                if (_activeMoreScreenId != null)
                  IconButton(
                    icon: const Icon(Icons.arrow_back, color: Color(0xFF818CF8)),
                    onPressed: () {
                      setState(() {
                        _activeMoreScreenId = null;
                      });
                    },
                  )
              ],
            )
          : null,
      body: bodyWidget,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentTabIndex,
        onTap: (index) {
          setState(() {
            _currentTabIndex = index;
            if (index != 4) {
              _activeMoreScreenId = null;
            }
          });
        },
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color(0xFF0F172A),
        selectedItemColor: const Color(0xFFA78BFA),
        unselectedItemColor: const Color(0xFF475569),
        selectedLabelStyle: GoogleFonts.inter(fontSize: 10.0, fontWeight: FontWeight.bold),
        unselectedLabelStyle: GoogleFonts.inter(fontSize: 10.0),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), activeIcon: Icon(Icons.dashboard), label: "Portal"),
          BottomNavigationBarItem(icon: Icon(Icons.auto_awesome_outlined), activeIcon: Icon(Icons.auto_awesome), label: "Co-Pilot"),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), activeIcon: Icon(Icons.account_balance_wallet), label: "Finance"),
          BottomNavigationBarItem(icon: Icon(Icons.group_work_outlined), activeIcon: Icon(Icons.group_work), label: "Sales CRM"),
          BottomNavigationBarItem(icon: Icon(Icons.grid_view_outlined), activeIcon: Icon(Icons.grid_view), label: "More Hub"),
        ],
      ),
    );
  }

  // Sub-navigation layout for advanced modules to fit mobile comfortably
  Widget _buildMoreHub() {
    if (_activeMoreScreenId == 'copywriter') {
      return const MarketingScreen();
    } else if (_activeMoreScreenId == 'hrm') {
      return const HRMScreen();
    } else if (_activeMoreScreenId == 'documents') {
      return const DocumentsScreen();
    } else if (_activeMoreScreenId == 'analytics') {
      return const AnalyticsScreen();
    } else if (_activeMoreScreenId == 'profile') {
      return ProfileScreen(
        onResetOnboarding: () {
          setState(() {
            _currentTabIndex = 0;
            _activeMoreScreenId = null;
          });
        },
      );
    }

    // Main hub selection grid
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            "More Intelligence Suites",
            style: GoogleFonts.spaceGrotesk(fontSize: 20.0, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          Text(
            "Tap any workspace below to access advanced AI utilities.",
            style: GoogleFonts.inter(fontSize: 12.0, color: const Color(0xFF64748B)),
          ),
          const SizedBox(height: 24.0),
          GridView.count(
            crossAxisCount: 2,
            crossAxisSpacing: 16.0,
            mainAxisSpacing: 16.0,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 1.25,
            children: [
              _buildHubGridButton(
                "Copywriter",
                "AI Social Captains",
                Icons.rate_review,
                const Color(0xFFC084FC),
                'copywriter',
              ),
              _buildHubGridButton(
                "HRM Screener",
                "Team Sourcing",
                Icons.badge_outlined,
                const Color(0xFF60A5FA),
                'hrm',
              ),
              _buildHubGridButton(
                "Doc Intelligence",
                "OCR Term Extractor",
                Icons.text_snippet_outlined,
                const Color(0xFFF472B6),
                'documents',
              ),
              _buildHubGridButton(
                "Analytics",
                "Growth Curves",
                Icons.bar_chart_outlined,
                const Color(0xFF34D399),
                'analytics',
              ),
              _buildHubGridButton(
                "Profile Settings",
                "Account Rules",
                Icons.tune,
                const Color(0xFFFBBF24),
                'profile',
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildHubGridButton(String title, String desc, IconData icon, Color accent, String screenId) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _activeMoreScreenId = screenId;
        });
      },
      child: Container(
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
            Container(
              padding: const EdgeInsets.all(10.0),
              decoration: BoxDecoration(
                color: accent.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: accent, size: 20.0),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 13.0,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  desc,
                  style: GoogleFonts.inter(
                    fontSize: 10.0,
                    color: const Color(0xFF64748B),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
