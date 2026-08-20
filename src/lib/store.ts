import { 
  UserProfile, 
  Transaction, 
  Budget, 
  Invoice, 
  Customer, 
  Order, 
  MarketingPost, 
  Employee, 
  ResumeAnalysis, 
  DocumentRecord, 
  BusinessHealth, 
  AppNotification, 
  CalendarEvent,
  ChatThread,
  ChatMessage
} from '../types';

// Pre-seeded Initial Data
const INITIAL_PROFILE: UserProfile = {
  name: "Meghaa Raj",
  email: "meghaaraj7882@gmail.com",
  companyName: "Zenith Tech Solutions",
  industry: "AI & Software Services",
  subscription: "Pro Genie",
  settings: {
    notificationsEnabled: true,
    voiceEnabled: true,
    theme: 'dark'
  }
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', date: '2026-07-15', description: 'Enterprise Software Consulting', type: 'income', amount: 125000, category: 'Consulting' },
  { id: 'tx-2', date: '2026-07-18', description: 'AWS Infrastructure Bill', type: 'expense', amount: 14500, category: 'Infrastructure' },
  { id: 'tx-3', date: '2026-07-19', description: 'SaaS Platform Subscriptions', type: 'income', amount: 48500, category: 'Product Subscriptions' },
  { id: 'tx-4', date: '2026-07-20', description: 'Office Space Rental', type: 'expense', amount: 25000, category: 'Operations' },
  { id: 'tx-5', date: '2026-07-20', description: 'Freelance AI Engineer Pay', type: 'expense', amount: 32000, category: 'Contractors' },
  { id: 'tx-6', date: '2026-07-21', description: 'AI Chatbot Setup Client B', type: 'income', amount: 89000, category: 'Consulting' }
];

const INITIAL_BUDGETS: Budget[] = [
  { id: 'b-1', name: 'Software & Cloud Tools', limit: 30000, spent: 14500, category: 'Infrastructure', period: 'monthly' },
  { id: 'b-2', name: 'Contractor & Freelance', limit: 80000, spent: 32000, category: 'Contractors', period: 'monthly' },
  { id: 'b-3', name: 'General Marketing', limit: 25000, spent: 11000, category: 'Marketing', period: 'monthly' },
  { id: 'b-4', name: 'Office & Facilities', limit: 40000, spent: 25000, category: 'Operations', period: 'monthly' }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNo: 'INV-2026-001',
    clientName: 'Nexus Global Inc.',
    clientEmail: 'billing@nexusglobal.com',
    amount: 125000,
    issueDate: '2026-07-01',
    dueDate: '2026-07-15',
    status: 'paid',
    items: [
      { description: 'Phase 1 Delivery: Custom Generative AI Pipeline integration', quantity: 1, unitPrice: 125000, amount: 125000 }
    ]
  },
  {
    id: 'inv-2',
    invoiceNo: 'INV-2026-002',
    clientName: 'Starlight Retail',
    clientEmail: 'finance@starlight.io',
    amount: 89000,
    issueDate: '2026-07-10',
    dueDate: '2026-07-24',
    status: 'pending',
    items: [
      { description: 'Business Automation & Workflow Mapping consulting', quantity: 1, unitPrice: 89000, amount: 89000 }
    ]
  },
  {
    id: 'inv-3',
    invoiceNo: 'INV-2026-003',
    clientName: 'Algonquin Agency',
    clientEmail: 'hello@algonquin.com',
    amount: 32000,
    issueDate: '2026-07-05',
    dueDate: '2026-07-20',
    status: 'overdue',
    items: [
      { description: 'Content Marketing Framework generation (AI powered)', quantity: 1, unitPrice: 32000, amount: 32000 }
    ]
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c-1', name: 'Marcus Sterling', email: 'marcus@nexusglobal.com', phone: '+91 98765 43210', company: 'Nexus Global Inc.', status: 'customer', notes: 'Key enterprise account. Looking for next-phase contract in Q4.', lastInteraction: '2026-07-15' },
  { id: 'c-2', name: 'Aaliyah Vance', email: 'aaliyah@starlight.io', phone: '+91 98123 45678', company: 'Starlight Retail', status: 'customer', notes: 'Interested in AI recommendation engine.', lastInteraction: '2026-07-18' },
  { id: 'c-3', name: 'Robert Chen', email: 'robert.chen@innovate.co', phone: '+91 99887 76655', company: 'Innovate Co', status: 'contacted', notes: 'Shared draft proposal for CRM customization.', lastInteraction: '2026-07-19' },
  { id: 'c-4', name: 'Elena Rostova', email: 'elena@cyberdefense.net', phone: '+91 97654 32109', company: 'CyberDefense Ltd', status: 'lead', notes: 'Met at AI Summit. High interest in OCR extraction services.', lastInteraction: '2026-07-20' }
];

const INITIAL_ORDERS: Order[] = [
  { id: 'ord-1', customerId: 'c-1', customerName: 'Marcus Sterling', product: 'AI Integration Contract', amount: 125000, date: '2026-07-01', status: 'completed' },
  { id: 'ord-2', customerId: 'c-2', customerName: 'Aaliyah Vance', product: 'Workflow Automation Setup', amount: 89000, date: '2026-07-10', status: 'pending' },
  { id: 'ord-3', customerId: 'c-3', customerName: 'Robert Chen', product: 'SEO Content Campaign Package', amount: 18000, date: '2026-07-19', status: 'pending' }
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Elena Fisher', role: 'Lead AI Engineer', department: 'Engineering', email: 'elena.f@zenithtech.io', salary: 1450000, attendanceRate: 98.2, leaveRemaining: 14, joinDate: '2025-02-15' },
  { id: 'emp-2', name: 'Devon Carter', role: 'Growth Marketing Manager', department: 'Marketing', email: 'devon@zenithtech.io', salary: 980000, attendanceRate: 95.5, leaveRemaining: 18, joinDate: '2025-06-01' },
  { id: 'emp-3', name: 'Sophia Lin', role: 'Technical Product Manager', department: 'Product', email: 'sophia@zenithtech.io', salary: 1120000, attendanceRate: 97.0, leaveRemaining: 12, joinDate: '2025-09-10' }
];

const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc-1',
    name: 'Q2_Financials_Summary.pdf',
    type: 'pdf',
    size: '1.2 MB',
    uploadDate: '2026-07-10',
    status: 'completed',
    summary: 'Executive overview of Q2 finances showing total growth of 24% YoY. Key cost drivers include cloud infrastructure (AWS) and contract engineering services. Sales from Consulting are highly lucrative but seasonal.',
    ocrText: 'Zenith Tech Solutions Q2 2026 Financial Report. Net Operating Revenue: ₹5,23,000. Expenses: ₹2,24,000. Profit margin 57%. Cloud hosting: ₹42,000. Salaries and Contractors: ₹1,40,000. Operating Reserve: ₹12,00,000.',
    extractedFields: {
      'Reporting Period': 'Q2 2026',
      'Net Revenue': '₹5,23,000',
      'Operating Margin': '57%',
      'Largest Cost Driver': 'Contractor Salaries'
    }
  },
  {
    id: 'doc-2',
    name: 'SaaS_Client_Agreement_Nexus.docx',
    type: 'docx',
    size: '480 KB',
    uploadDate: '2026-07-15',
    status: 'completed',
    summary: 'Service level agreement between Zenith Tech Solutions and Nexus Global Inc. Specifies delivery of 1 Custom Generative AI Pipeline, net terms of 14 days, and total compensation of ₹1,25,000.',
    ocrText: 'MASTER SERVICES AGREEMENT: Zenith Tech Solutions agrees to deliver a customized artificial intelligence pipeline to Nexus Global Inc. Deliverables include core prompt infrastructure, model tuning configs, and multi-endpoint orchestration routing. Total contract amount: ₹1,25,000 due 14 days from deliverable completion.',
    extractedFields: {
      'Client Name': 'Nexus Global Inc.',
      'Contract Value': '₹1,25,000',
      'Payment Terms': 'Net 14',
      'Project Scope': 'Custom Generative AI Pipeline'
    }
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'n-1', title: 'Invoice #INV-2026-003 Overdue', description: 'Algonquin Agency has not paid the outstanding balance of ₹32,000 (Due July 20).', category: 'finance', priority: 'urgent', timestamp: '2026-07-20T10:00:00Z', read: false },
  { id: 'n-2', title: 'Software Budget Alert', description: 'Software & Cloud Tools monthly budget has reached 82% of its ₹30,000 limit.', category: 'finance', priority: 'warning', timestamp: '2026-07-21T08:15:00Z', read: false },
  { id: 'n-3', title: 'Upcoming Client Sync', description: 'Starlight Retail project kickoff meeting scheduled for today at 3:00 PM.', category: 'general', priority: 'info', timestamp: '2026-07-21T09:00:00Z', read: false },
  { id: 'n-4', title: 'New AI Insights Ready', description: 'Your business health score has improved to 88/100! Tap to view recommendation reports.', category: 'assistant', priority: 'info', timestamp: '2026-07-21T01:30:00Z', read: true }
];

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'ev-1', title: 'Nexus Deliverable Sign-off', date: '2026-07-15', time: '11:00 AM', category: 'deadline', description: 'Review Generative AI Pipeline with Marcus Sterling.' },
  { id: 'ev-2', title: 'Kickoff with Starlight Retail', date: '2026-07-21', time: '03:00 PM', category: 'meeting', description: 'Discuss workflow automation implementation details.' },
  { id: 'ev-3', title: 'Salary & Invoice Run', date: '2026-07-25', time: '09:00 AM', category: 'finance', description: 'Process contractor bills and draft pending client invoices.' },
  { id: 'ev-4', title: 'Innovate Co Review Call', date: '2026-07-23', time: '02:00 PM', category: 'meeting', description: 'Follow-up on the CRM integration proposal with Robert.' }
];

const INITIAL_HEALTH: BusinessHealth = {
  score: 88,
  runwayMonths: 8.5,
  growthRate: 15.4,
  cashFlowRatio: 1.85,
  recommendations: [
    {
      id: 'rec-1',
      title: 'Hedge SaaS Cloud Infrastructure',
      description: 'Your AWS Infrastructure expenses are rising 12% MoM. Consider setting up AWS Savings Plans or running spot instances for model caching nodes to recoup up to ₹4,500/month.',
      priority: 'medium',
      category: 'finance'
    },
    {
      id: 'rec-2',
      title: 'Invoice Algonquin Agency Follow-up',
      description: 'Invoice INV-2026-003 is overdue. Automate custom email reminders with an attached payment link to improve cash conversion latency.',
      priority: 'high',
      category: 'finance'
    },
    {
      id: 'rec-3',
      title: 'Launch Linkedin Post Campaign',
      description: 'Consulting revenue is peaking, but leads are standard. Generate and publish expert SaaS architecture articles to LinkedIn to source 2-3 new enterprise leads this week.',
      priority: 'medium',
      category: 'marketing'
    },
    {
      id: 'rec-4',
      title: 'Resume Screening Optimization',
      description: 'Sophia Lin (Technical PM) is operating at full capacity. Screen incoming PM resumes via Document Intelligence to expedite sourcing a Junior PM helper.',
      priority: 'low',
      category: 'hr'
    }
  ]
};

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'th-1',
    title: 'Welcome Strategy Session',
    updatedAt: '2026-07-21T01:30:00Z',
    messages: [
      { id: 'msg-1', role: 'model', content: `Hello! I am **BizGenie AI**, your intelligent business companion. 🧞‍♂️✨

I've automatically ingested your Zenith Tech Solutions financials and operations. Here is a quick snapshot of what we can tackle:
1. **Analyze Financial Performance**: Optimize cloud hosting budgets or forecast Q3 consulting revenues in Indian Rupee (₹).
2. **Draft Marketing Copy**: Generate high-engaging LinkedIn or Instagram posts tailored to your tech solutions.
3. **Draft Professional Communications**: Auto-write payment reminders for Algonquin Agency or screen candidate resumes.

What business priority can I assist you with today?`, timestamp: '2026-07-21T01:30:00Z' }
    ]
  }
];

export class BizGenieStore {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      const versionKey = 'bg_inr_currency_v2';
      const isUpgraded = localStorage.getItem(versionKey);

      // Seed or upgrade if not updated to INR version
      if (!isUpgraded || !localStorage.getItem('bg_profile')) {
        localStorage.setItem(versionKey, 'true');
        localStorage.setItem('bg_profile', JSON.stringify(INITIAL_PROFILE));
        localStorage.setItem('bg_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
        localStorage.setItem('bg_budgets', JSON.stringify(INITIAL_BUDGETS));
        localStorage.setItem('bg_invoices', JSON.stringify(INITIAL_INVOICES));
        localStorage.setItem('bg_customers', JSON.stringify(INITIAL_CUSTOMERS));
        localStorage.setItem('bg_orders', JSON.stringify(INITIAL_ORDERS));
        localStorage.setItem('bg_employees', JSON.stringify(INITIAL_EMPLOYEES));
        localStorage.setItem('bg_documents', JSON.stringify(INITIAL_DOCUMENTS));
        localStorage.setItem('bg_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
        localStorage.setItem('bg_events', JSON.stringify(INITIAL_EVENTS));
        localStorage.setItem('bg_health', JSON.stringify(INITIAL_HEALTH));
        localStorage.setItem('bg_threads', JSON.stringify(INITIAL_THREADS));
        localStorage.setItem('bg_resumeAnalyses', JSON.stringify([]));
        localStorage.setItem('bg_marketingPosts', JSON.stringify([]));
      }
    }
  }

  // Generic Getter / Setter helpers
  private get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const val = localStorage.getItem(`bg_${key}`);
    return val ? JSON.parse(val) : defaultValue;
  }

  private set<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`bg_${key}`, JSON.stringify(value));
      this.notify();
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Getters & Actions for individual sub-modules
  public getProfile(): UserProfile { return this.get('profile', INITIAL_PROFILE); }
  public updateProfile(profile: UserProfile) { this.set('profile', profile); }

  public getTransactions(): Transaction[] { return this.get('transactions', INITIAL_TRANSACTIONS); }
  public addTransaction(tx: Omit<Transaction, 'id'>) {
    const transactions = this.getTransactions();
    const newTx = { ...tx, id: `tx-${Date.now()}` };
    transactions.unshift(newTx);
    this.set('transactions', transactions);
    
    // Recalculate health and budget expenditures when transactions update
    this.recalculateFinanceEffects(newTx);
  }

  private recalculateFinanceEffects(tx: Transaction) {
    // If it's an expense, update corresponding budget if category matches
    if (tx.type === 'expense') {
      const budgets = this.getBudgets();
      const updatedBudgets = budgets.map(b => {
        if (b.category.toLowerCase() === tx.category.toLowerCase()) {
          const newSpent = b.spent + tx.amount;
          if (newSpent > b.limit) {
            // Trigger critical notification
            this.addNotification({
              title: `Budget Exceeded: ${b.name}`,
              description: `Expenditures on ${b.name} reached ₹${newSpent.toLocaleString('en-IN')}, exceeding your budget limit of ₹${b.limit.toLocaleString('en-IN')}.`,
              category: 'finance',
              priority: 'urgent'
            });
          } else if (newSpent >= b.limit * 0.8 && b.spent < b.limit * 0.8) {
            // Trigger threshold warning notification
            this.addNotification({
              title: `Budget Warning: ${b.name}`,
              description: `Expenditures on ${b.name} are at ${Math.round((newSpent / b.limit) * 100)}% of your limit.`,
              category: 'finance',
              priority: 'warning'
            });
          }
          return { ...b, spent: newSpent };
        }
        return b;
      });
      this.set('budgets', updatedBudgets);
    }
    
    // Auto recalculate business health score dynamically!
    this.recomputeBusinessHealthScore();
  }

  private recomputeBusinessHealthScore() {
    const txs = this.getTransactions();
    const totalIncome = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate simple health score based on profit margin
    const netProfit = totalIncome - totalExpense;
    let score = 80;
    if (totalIncome > 0) {
      const margin = (netProfit / totalIncome) * 100;
      if (margin > 50) score = 92;
      else if (margin > 30) score = 87;
      else if (margin > 10) score = 78;
      else if (margin > 0) score = 70;
      else score = 55;
    }

    const health = this.getHealth();
    this.set('health', {
      ...health,
      score,
      cashFlowRatio: Number((totalIncome / (totalExpense || 1)).toFixed(2))
    });
  }

  public deleteTransaction(id: string) {
    const transactions = this.getTransactions().filter(t => t.id !== id);
    this.set('transactions', transactions);
    this.recomputeBusinessHealthScore();
  }

  public getBudgets(): Budget[] { return this.get('budgets', INITIAL_BUDGETS); }
  public addBudget(b: Omit<Budget, 'id'>) {
    const budgets = this.getBudgets();
    budgets.push({ ...b, id: `b-${Date.now()}` });
    this.set('budgets', budgets);
  }

  public getInvoices(): Invoice[] { return this.get('invoices', INITIAL_INVOICES); }
  public addInvoice(inv: Omit<Invoice, 'id'>) {
    const invoices = this.getInvoices();
    const newInv = { ...inv, id: `inv-${Date.now()}` };
    invoices.unshift(newInv);
    this.set('invoices', invoices);

    // If invoice is created as paid, add a corresponding transaction record
    if (newInv.status === 'paid') {
      this.addTransaction({
        date: newInv.issueDate,
        description: `Payment received for ${newInv.invoiceNo} (${newInv.clientName})`,
        type: 'income',
        amount: newInv.amount,
        category: 'Invoicing'
      });
    }

    // Trigger notification
    this.addNotification({
      title: `Invoice Generated`,
      description: `Invoice ${newInv.invoiceNo} ($${newInv.amount}) sent to ${newInv.clientName}.`,
      category: 'finance',
      priority: 'info'
    });
  }

  public updateInvoiceStatus(id: string, status: 'paid' | 'pending' | 'overdue') {
    const invoices = this.getInvoices();
    const index = invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      const oldInv = invoices[index];
      invoices[index] = { ...oldInv, status };
      this.set('invoices', invoices);

      // If transition to paid, record corresponding transaction
      if (status === 'paid' && oldInv.status !== 'paid') {
        this.addTransaction({
          date: new Date().toISOString().split('T')[0],
          description: `Payment received for ${oldInv.invoiceNo} (${oldInv.clientName})`,
          type: 'income',
          amount: oldInv.amount,
          category: 'Invoicing'
        });
      }
    }
  }

  public getCustomers(): Customer[] { return this.get('customers', INITIAL_CUSTOMERS); }
  public addCustomer(c: Omit<Customer, 'id' | 'lastInteraction'>) {
    const customers = this.getCustomers();
    const newCust = { 
      ...c, 
      id: `c-${Date.now()}`, 
      lastInteraction: new Date().toISOString().split('T')[0] 
    };
    customers.unshift(newCust);
    this.set('customers', customers);

    // Trigger notification
    this.addNotification({
      title: `New Lead Registered`,
      description: `${newCust.name} from ${newCust.company} was added as a prospective ${newCust.status}.`,
      category: 'sales',
      priority: 'info'
    });
  }

  public updateCustomerStatus(id: string, status: 'lead' | 'contacted' | 'customer') {
    const customers = this.getCustomers();
    const idx = customers.findIndex(c => c.id === id);
    if (idx !== -1) {
      customers[idx] = { 
        ...customers[idx], 
        status, 
        lastInteraction: new Date().toISOString().split('T')[0] 
      };
      this.set('customers', customers);
    }
  }

  public getOrders(): Order[] { return this.get('orders', INITIAL_ORDERS); }
  public addOrder(o: Omit<Order, 'id' | 'date'>) {
    const orders = this.getOrders();
    const newOrder = { 
      ...o, 
      id: `ord-${Date.now()}`, 
      date: new Date().toISOString().split('T')[0] 
    };
    orders.unshift(newOrder);
    this.set('orders', orders);

    // Update customer's status to 'customer' automatically if order is completed
    if (o.status === 'completed') {
      this.updateCustomerStatus(o.customerId, 'customer');
      this.addTransaction({
        date: newOrder.date,
        description: `Order Completed: ${newOrder.product} (${newOrder.customerName})`,
        type: 'income',
        amount: newOrder.amount,
        category: 'Sales'
      });
    }
  }

  public getEmployees(): Employee[] { return this.get('employees', INITIAL_EMPLOYEES); }
  public addEmployee(e: Omit<Employee, 'id'>) {
    const employees = this.getEmployees();
    employees.push({ ...e, id: `emp-${Date.now()}` });
    this.set('employees', employees);
  }

  public deleteEmployee(id: string) {
    const employees = this.getEmployees().filter(e => e.id !== id);
    this.set('employees', employees);
  }

  public updateEmployeeAttendance(id: string, leaveRemaining: number, attendanceRate: number) {
    const employees = this.getEmployees();
    const idx = employees.findIndex(e => e.id === id);
    if (idx !== -1) {
      employees[idx] = { ...employees[idx], leaveRemaining, attendanceRate };
      this.set('employees', employees);
    }
  }

  public getResumeAnalyses(): ResumeAnalysis[] { return this.get('resumeAnalyses', []); }
  public addResumeAnalysis(ra: ResumeAnalysis) {
    const items = this.getResumeAnalyses();
    items.unshift(ra);
    this.set('resumeAnalyses', items);

    this.addNotification({
      title: `Resume Screened: ${ra.candidateName}`,
      description: `Successfully analyzed CV for ${ra.targetRole}. Role match score: ${ra.matchScore}%`,
      category: 'hr',
      priority: 'info'
    });
  }

  public getDocuments(): DocumentRecord[] { return this.get('documents', INITIAL_DOCUMENTS); }
  public addDocument(doc: DocumentRecord) {
    const docs = this.getDocuments();
    docs.unshift(doc);
    this.set('documents', docs);

    this.addNotification({
      title: `Document Uploaded: ${doc.name}`,
      description: `Processing completed. OCR text extracted and AI intelligence generated.`,
      category: 'general',
      priority: 'info'
    });
  }

  public deleteDocument(id: string) {
    const docs = this.getDocuments().filter(d => d.id !== id);
    this.set('documents', docs);
  }

  public getMarketingPosts(): MarketingPost[] { return this.get('marketingPosts', []); }
  public addMarketingPost(post: Omit<MarketingPost, 'id' | 'date'>) {
    const posts = this.getMarketingPosts();
    const newPost = {
      ...post,
      id: `mp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    posts.unshift(newPost);
    this.set('marketingPosts', posts);
  }

  public updateMarketingPostStatus(id: string, status: 'draft' | 'scheduled' | 'published') {
    const posts = this.getMarketingPosts();
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) {
      posts[idx] = { ...posts[idx], status };
      this.set('marketingPosts', posts);
    }
  }

  public getNotifications(): AppNotification[] { return this.get('notifications', INITIAL_NOTIFICATIONS); }
  public addNotification(noti: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    const notifications = this.getNotifications();
    const newNoti = {
      ...noti,
      id: `n-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    notifications.unshift(newNoti);
    this.set('notifications', notifications);
  }

  public markAllNotificationsAsRead() {
    const notifications = this.getNotifications().map(n => ({ ...n, read: true }));
    this.set('notifications', notifications);
  }

  public markNotificationAsRead(id: string) {
    const notifications = this.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    this.set('notifications', notifications);
  }

  public getEvents(): CalendarEvent[] { return this.get('events', INITIAL_EVENTS); }
  public addEvent(ev: Omit<CalendarEvent, 'id'>) {
    const events = this.getEvents();
    events.push({ ...ev, id: `ev-${Date.now()}` });
    this.set('events', events);
  }

  public getHealth(): BusinessHealth { return this.get('health', INITIAL_HEALTH); }

  // ChatGPT-style Chat history persistence
  public getThreads(): ChatThread[] { return this.get('threads', INITIAL_THREADS); }
  public createThread(title: string): ChatThread {
    const threads = this.getThreads();
    const newThread: ChatThread = {
      id: `th-${Date.now()}`,
      title,
      updatedAt: new Date().toISOString(),
      messages: []
    };
    threads.unshift(newThread);
    this.set('threads', threads);
    return newThread;
  }

  public addMessageToThread(threadId: string, role: 'user' | 'model', content: string, files?: ChatMessage['files'], isVoice?: boolean) {
    const threads = this.getThreads();
    const idx = threads.findIndex(t => t.id === threadId);
    if (idx !== -1) {
      const msg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role,
        content,
        timestamp: new Date().toISOString(),
        files,
        isVoice
      };
      threads[idx].messages.push(msg);
      threads[idx].updatedAt = new Date().toISOString();
      
      // Update thread title if it was empty or default and it is the first user message
      if (threads[idx].title === 'New Chat' || threads[idx].messages.length <= 2) {
        threads[idx].title = content.slice(0, 30) + (content.length > 30 ? '...' : '');
      }
      
      this.set('threads', threads);
    }
  }

  public deleteThread(id: string) {
    const threads = this.getThreads().filter(t => t.id !== id);
    this.set('threads', threads);
  }
}

export const store = new BizGenieStore();
