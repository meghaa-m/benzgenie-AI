import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/types.dart';

class BizGenieStore extends ChangeNotifier {
  late SharedPreferences _prefs;
  bool _initialized = false;

  bool get isInitialized => _initialized;

  // State Variables
  UserProfile _profile = UserProfile(
    name: "Meghaa Raj",
    email: "meghaaraj7882@gmail.com",
    companyName: "Zenith Tech Solutions",
    industry: "AI & Software Services",
    subscription: "Pro Genie",
    notificationsEnabled: true,
    voiceEnabled: true,
    theme: "dark",
  );

  List<Transaction> _transactions = [];
  List<Budget> _budgets = [];
  List<Invoice> _invoices = [];
  List<Customer> _customers = [];
  List<Order> _orders = [];
  List<Employee> _employees = [];
  List<DocumentRecord> _documents = [];
  List<AppNotification> _notifications = [];
  List<CalendarEvent> _events = [];
  List<ChatThread> _threads = [];
  List<MarketingPost> _marketingPosts = [];

  // Getters
  UserProfile get profile => _profile;
  List<Transaction> get transactions => _transactions;
  List<Budget> get budgets => _budgets;
  List<Invoice> get invoices => _invoices;
  List<Customer> get customers => _customers;
  List<Order> get orders => _orders;
  List<Employee> get employees => _employees;
  List<DocumentRecord> get documents => _documents;
  List<AppNotification> get notifications => _notifications;
  List<CalendarEvent> get events => _events;
  List<ChatThread> get threads => _threads;
  List<MarketingPost> get marketingPosts => _marketingPosts;

  BizGenieStore() {
    _initPrefs();
  }

  Future<void> _initPrefs() async {
    _prefs = await SharedPreferences.getInstance();
    
    // Check if currency version matches INR migration
    String? currencyVer = _prefs.getString('bg_currency_ver');

    if (_prefs.containsKey('bg_profile') && currencyVer == 'inr_v10') {
      _loadFromPrefs();
    } else {
      _seedInitialData();
      await _prefs.setString('bg_currency_ver', 'inr_v10');
    }
    _initialized = true;
    notifyListeners();
  }

  void _seedInitialData() {
    _transactions = [
      Transaction(id: 'tx-1', date: '2026-07-15', description: 'Enterprise Software Consulting', type: 'income', amount: 125000, category: 'Consulting'),
      Transaction(id: 'tx-2', date: '2026-07-18', description: 'AWS Infrastructure Bill', type: 'expense', amount: 14500, category: 'Infrastructure'),
      Transaction(id: 'tx-3', date: '2026-07-19', description: 'SaaS Platform Subscriptions', type: 'income', amount: 48500, category: 'Product Subscriptions'),
      Transaction(id: 'tx-4', date: '2026-07-20', description: 'Office Space Rental', type: 'expense', amount: 25000, category: 'Operations'),
      Transaction(id: 'tx-5', date: '2026-07-20', description: 'Freelance AI Engineer Pay', type: 'expense', amount: 32000, category: 'Contractors'),
      Transaction(id: 'tx-6', date: '2026-07-21', description: 'AI Chatbot Setup Client B', type: 'income', amount: 89000, category: 'Consulting'),
    ];

    _budgets = [
      Budget(id: 'b-1', name: 'Software & Cloud Tools', limit: 30000, spent: 14500, category: 'Infrastructure', period: 'monthly'),
      Budget(id: 'b-2', name: 'Contractor & Freelance', limit: 80000, spent: 32000, category: 'Contractors', period: 'monthly'),
      Budget(id: 'b-3', name: 'General Marketing', limit: 25000, spent: 11000, category: 'Marketing', period: 'monthly'),
      Budget(id: 'b-4', name: 'Office & Facilities', limit: 40000, spent: 25000, category: 'Operations', period: 'monthly'),
    ];

    _invoices = [
      Invoice(
        id: 'inv-1',
        invoiceNo: 'INV-2026-001',
        clientName: 'Nexus Global Inc.',
        clientEmail: 'billing@nexusglobal.com',
        amount: 125000,
        issueDate: '2026-07-01',
        dueDate: '2026-07-15',
        status: 'paid',
        items: [InvoiceItem(description: 'Phase 1 Delivery: Custom Generative AI Pipeline integration', quantity: 1, unitPrice: 125000, amount: 125000)],
      ),
      Invoice(
        id: 'inv-2',
        invoiceNo: 'INV-2026-002',
        clientName: 'Starlight Retail',
        clientEmail: 'finance@starlight.io',
        amount: 89000,
        issueDate: '2026-07-10',
        dueDate: '2026-07-24',
        status: 'pending',
        items: [InvoiceItem(description: 'Business Automation & Workflow Mapping consulting', quantity: 1, unitPrice: 89000, amount: 89000)],
      ),
      Invoice(
        id: 'inv-3',
        invoiceNo: 'INV-2026-003',
        clientName: 'Algonquin Agency',
        clientEmail: 'hello@algonquin.com',
        amount: 32000,
        issueDate: '2026-07-05',
        dueDate: '2026-07-20',
        status: 'overdue',
        items: [InvoiceItem(description: 'Content Marketing Framework generation (AI powered)', quantity: 1, unitPrice: 32000, amount: 32000)],
      ),
    ];

    _customers = [
      Customer(id: 'c-1', name: 'Marcus Sterling', email: 'marcus@nexusglobal.com', phone: '+91 98765 43210', company: 'Nexus Global Inc.', status: 'customer', notes: 'Key enterprise account. Looking for next-phase contract in Q4.', lastInteraction: '2026-07-15'),
      Customer(id: 'c-2', name: 'Aaliyah Vance', email: 'aaliyah@starlight.io', phone: '+91 98123 45678', company: 'Starlight Retail', status: 'customer', notes: 'Interested in AI recommendation engine.', lastInteraction: '2026-07-18'),
      Customer(id: 'c-3', name: 'Robert Chen', email: 'robert.chen@innovate.co', phone: '+91 97654 32109', company: 'Innovate Co', status: 'contacted', notes: 'Shared draft proposal for CRM customization.', lastInteraction: '2026-07-19'),
      Customer(id: 'c-4', name: 'Elena Rostova', email: 'elena@cyberdefense.net', phone: '+91 96543 21098', company: 'CyberDefense Ltd', status: 'lead', notes: 'Met at AI Summit. High interest in OCR extraction services.', lastInteraction: '2026-07-20'),
    ];

    _orders = [
      Order(id: 'ord-1', customerId: 'c-1', customerName: 'Marcus Sterling', product: 'AI Integration Contract', amount: 125000, date: '2026-07-01', status: 'completed'),
      Order(id: 'ord-2', customerId: 'c-2', customerName: 'Aaliyah Vance', product: 'Workflow Automation Setup', amount: 89000, date: '2026-07-10', status: 'pending'),
      Order(id: 'ord-3', customerId: 'c-3', customerName: 'Robert Chen', product: 'SEO Content Campaign Package', amount: 18000, date: '2026-07-19', status: 'pending'),
    ];

    _employees = [
      Employee(id: 'emp-1', name: 'Elena Fisher', role: 'Lead AI Engineer', department: 'Engineering', email: 'elena.f@zenithtech.io', salary: 1800000, attendanceRate: 98.2, leaveRemaining: 14, joinDate: '2025-02-15'),
      Employee(id: 'emp-2', name: 'Devon Carter', role: 'Growth Marketing Manager', department: 'Marketing', email: 'devon@zenithtech.io', salary: 1200000, attendanceRate: 95.5, leaveRemaining: 18, joinDate: '2025-06-01'),
      Employee(id: 'emp-3', name: 'Sophia Lin', role: 'Technical Product Manager', department: 'Product', email: 'sophia@zenithtech.io', salary: 1500000, attendanceRate: 97.0, leaveRemaining: 12, joinDate: '2025-09-10'),
    ];

    _documents = [
      DocumentRecord(
        id: 'doc-1',
        name: 'Q2_Financials_Summary.pdf',
        type: 'pdf',
        size: '1.2 MB',
        uploadDate: '2026-07-10',
        status: 'completed',
        summary: 'Executive overview of Q2 finances showing total growth of 24% YoY. Key cost drivers include cloud infrastructure (AWS) and contract engineering services.',
      ),
      DocumentRecord(
        id: 'doc-2',
        name: 'SaaS_Client_Agreement_Nexus.docx',
        type: 'docx',
        size: '480 KB',
        uploadDate: '2026-07-15',
        status: 'completed',
        summary: 'Service level agreement between Zenith Tech Solutions and Nexus Global Inc. Specifies delivery of 1 Custom Generative AI Pipeline, net terms of 14 days, and total compensation of ₹1,25,000.',
      ),
    ];

    _notifications = [
      AppNotification(id: 'n-1', title: 'Invoice #INV-2026-003 Overdue', description: 'Algonquin Agency has not paid outstanding balance of ₹32,000.', category: 'finance', priority: 'urgent', timestamp: '2026-07-20T10:00:00Z', read: false),
      AppNotification(id: 'n-2', title: 'Software Budget Alert', description: 'Software & Cloud Tools monthly budget has reached 82% of limit.', category: 'finance', priority: 'warning', timestamp: '2026-07-21T08:15:00Z', read: false),
      AppNotification(id: 'n-3', title: 'Upcoming Client Sync', description: 'Starlight Retail project kickoff meeting scheduled for today at 3:00 PM.', category: 'general', priority: 'info', timestamp: '2026-07-21T09:00:00Z', read: false),
    ];

    _events = [
      CalendarEvent(id: 'ev-1', title: 'Nexus Deliverable Sign-off', date: '2026-07-15', time: '11:00 AM', category: 'deadline', description: 'Review Generative AI Pipeline with Marcus Sterling.'),
      CalendarEvent(id: 'ev-2', title: 'Kickoff with Starlight Retail', date: '2026-07-21', time: '03:00 PM', category: 'meeting', description: 'Discuss workflow automation implementation details.'),
      CalendarEvent(id: 'ev-3', title: 'Salary & Invoice Run', date: '2026-07-25', time: '09:00 AM', category: 'finance', description: 'Process contractor bills and draft pending client invoices.'),
    ];

    _threads = [
      ChatThread(
        id: 'th-1',
        title: 'Welcome Strategy Session',
        updatedAt: '2026-07-21T01:30:00Z',
        messages: [
          ChatMessage(
            id: 'msg-1',
            role: 'model',
            content: 'Hello! I am BizGenie AI, your intelligent business companion. 🧞‍♂️✨\n\nI\'ve automatically ingested your Zenith Tech Solutions financials and operations. Ready to optimize your business!',
            timestamp: '2026-07-21T01:30:00Z',
          )
        ],
      )
    ];

    _saveToPrefs();
  }

  void _loadFromPrefs() {
    _profile = UserProfile.fromJson(jsonDecode(_prefs.getString('bg_profile')!));
    
    _transactions = (jsonDecode(_prefs.getString('bg_transactions')!) as List)
        .map((e) => Transaction.fromJson(e))
        .toList();

    _budgets = (jsonDecode(_prefs.getString('bg_budgets')!) as List)
        .map((e) => Budget.fromJson(e))
        .toList();

    _invoices = (jsonDecode(_prefs.getString('bg_invoices')!) as List)
        .map((e) => Invoice.fromJson(e))
        .toList();

    _customers = (jsonDecode(_prefs.getString('bg_customers')!) as List)
        .map((e) => Customer.fromJson(e))
        .toList();

    _orders = (jsonDecode(_prefs.getString('bg_orders')!) as List)
        .map((e) => Order.fromJson(e))
        .toList();

    _employees = (jsonDecode(_prefs.getString('bg_employees')!) as List)
        .map((e) => Employee.fromJson(e))
        .toList();

    _documents = (jsonDecode(_prefs.getString('bg_documents')!) as List)
        .map((e) => DocumentRecord.fromJson(e))
        .toList();

    _notifications = (jsonDecode(_prefs.getString('bg_notifications')!) as List)
        .map((e) => AppNotification.fromJson(e))
        .toList();

    _events = (jsonDecode(_prefs.getString('bg_events')!) as List)
        .map((e) => CalendarEvent.fromJson(e))
        .toList();

    if (_prefs.containsKey('bg_threads')) {
      _threads = (jsonDecode(_prefs.getString('bg_threads')!) as List)
          .map((e) => ChatThread.fromJson(e))
          .toList();
    }
    
    if (_threads.isEmpty) {
      _threads = [
        ChatThread(
          id: 'th-1',
          title: 'Welcome Strategy Session',
          updatedAt: '2026-07-21T01:30:00Z',
          messages: [
            ChatMessage(
              id: 'msg-1',
              role: 'model',
              content: 'Hello! I am BizGenie AI, your intelligent business co-pilot. 🧞‍♂️✨\n\nI\'ve automatically ingested your Zenith Tech Solutions financials and operations. Ready to optimize your business!',
              timestamp: '2026-07-21T01:30:00Z',
            )
          ],
        )
      ];
    }

    if (_prefs.containsKey('bg_marketingPosts')) {
      _marketingPosts = (jsonDecode(_prefs.getString('bg_marketingPosts')!) as List)
          .map((e) => MarketingPost.fromJson(e))
          .toList();
    }
  }

  void _saveToPrefs() {
    _prefs.setString('bg_profile', jsonEncode(_profile.toJson()));
    _prefs.setString('bg_transactions', jsonEncode(_transactions.map((e) => e.toJson()).toList()));
    _prefs.setString('bg_budgets', jsonEncode(_budgets.map((e) => e.toJson()).toList()));
    _prefs.setString('bg_invoices', jsonEncode(_invoices.map((e) => e.toJson()).toList()));
    _prefs.setString('bg_customers', jsonEncode(_customers.map((e) => e.toJson()).toList()));
    _prefs.setString('bg_orders', jsonEncode(_orders.map((e) => e.toJson()).toList()));
    _prefs.setString('bg_employees', jsonEncode(_employees.map((e) => e.toJson()).toList()));
    _prefs.setString('bg_documents', jsonEncode(_documents.map((e) => e.toJson()).toList()));
    _prefs.setString('bg_notifications', jsonEncode(_notifications.map((e) => e.toJson()).toList()));
    _prefs.setString('bg_events', jsonEncode(_events.map((e) => e.toJson()).toList()));
    _prefs.setString('bg_threads', jsonEncode(_threads.map((e) => e.toJson()).toList()));
    _prefs.setString('bg_marketingPosts', jsonEncode(_marketingPosts.map((e) => e.toJson()).toList()));
  }

  // Setters & Actions
  void updateProfile(UserProfile newProfile) {
    _profile = newProfile;
    _saveToPrefs();
    notifyListeners();
  }

  void setOnboardingCompleted() {
    _prefs.setBool('bizgenie_onboarding_done', true);
    notifyListeners();
  }

  bool isOnboardingDone() {
    return _prefs.getBool('bizgenie_onboarding_done') ?? false;
  }

  void clearOnboarding() {
    _prefs.remove('bizgenie_onboarding_done');
    notifyListeners();
  }

  // Transactions
  void addTransaction(Transaction tx) {
    _transactions.insert(0, tx);
    // Update budget spent
    for (var b in _budgets) {
      if (b.category == tx.category && tx.type == 'expense') {
        b.spent += tx.amount;
      }
    }
    _saveToPrefs();
    notifyListeners();
  }

  // Invoices
  void addInvoice(Invoice inv) {
    _invoices.insert(0, inv);
    _saveToPrefs();
    notifyListeners();
  }

  void updateInvoiceStatus(String id, String status) {
    int idx = _invoices.indexWhere((element) => element.id == id);
    if (idx != -1) {
      Invoice old = _invoices[idx];
      _invoices[idx] = Invoice(
        id: old.id,
        invoiceNo: old.invoiceNo,
        clientName: old.clientName,
        clientEmail: old.clientEmail,
        amount: old.amount,
        issueDate: old.issueDate,
        dueDate: old.dueDate,
        status: status,
        items: old.items,
      );
      _saveToPrefs();
      notifyListeners();
    }
  }

  // Budgets
  void addBudget(Budget b) {
    _budgets.add(b);
    _saveToPrefs();
    notifyListeners();
  }

  // Customers
  void addCustomer(Customer c) {
    _customers.add(c);
    _saveToPrefs();
    notifyListeners();
  }

  // Employees
  void addEmployee(Employee emp) {
    _employees.add(emp);
    _saveToPrefs();
    notifyListeners();
  }

  void deleteEmployee(String id) {
    _employees.removeWhere((element) => element.id == id);
    _saveToPrefs();
    notifyListeners();
  }

  // Documents
  void addDocument(DocumentRecord doc) {
    _documents.insert(0, doc);
    _saveToPrefs();
    notifyListeners();
  }

  void deleteDocument(String id) {
    _documents.removeWhere((element) => element.id == id);
    _saveToPrefs();
    notifyListeners();
  }

  // Notifications
  void markNotificationAsRead(String id) {
    for (var n in _notifications) {
      if (n.id == id) {
        n.read = true;
      }
    }
    _saveToPrefs();
    notifyListeners();
  }

  void markAllNotificationsAsRead() {
    for (var n in _notifications) {
      n.read = true;
    }
    _saveToPrefs();
    notifyListeners();
  }

  void clearNotifications() {
    _notifications.clear();
    _saveToPrefs();
    notifyListeners();
  }

  // Chat/Threads
  void addChatMessage(String threadId, ChatMessage msg) {
    int idx = _threads.indexWhere((t) => t.id == threadId);
    if (idx != -1) {
      ChatThread old = _threads[idx];
      List<ChatMessage> newMsgs = List.from(old.messages)..add(msg);
      _threads[idx] = ChatThread(
        id: old.id,
        title: old.title,
        updatedAt: DateTime.now().toIso8601String(),
        messages: newMsgs,
      );
    } else {
      _threads.add(
        ChatThread(
          id: threadId,
          title: 'Co-Pilot Strategy Session',
          updatedAt: DateTime.now().toIso8601String(),
          messages: [msg],
        ),
      );
    }
    _saveToPrefs();
    notifyListeners();
  }

  void resetChatThread(String threadId) {
    int idx = _threads.indexWhere((t) => t.id == threadId);
    ChatThread newThread = ChatThread(
      id: threadId,
      title: 'Welcome Strategy Session',
      updatedAt: DateTime.now().toIso8601String(),
      messages: [
        ChatMessage(
          id: 'msg-${DateTime.now().millisecondsSinceEpoch}',
          role: 'model',
          content: 'Hello! I am BizGenie AI, your intelligent business co-pilot. 🧞‍♂️✨\n\nI\'ve synchronized with your ${_profile.businessName} live workspace and financial ledgers. Ready to optimize your business!',
          timestamp: DateTime.now().toIso8601String(),
        )
      ],
    );

    if (idx != -1) {
      _threads[idx] = newThread;
    } else {
      _threads.add(newThread);
    }
    _saveToPrefs();
    notifyListeners();
  }

  // Marketing Posts
  void addMarketingPost(MarketingPost post) {
    _marketingPosts.insert(0, post);
    _saveToPrefs();
    notifyListeners();
  }

  void deleteMarketingPost(String id) {
    _marketingPosts.removeWhere((element) => element.id == id);
    _saveToPrefs();
    notifyListeners();
  }
}
