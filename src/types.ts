export type Theme = 'light' | 'dark' | 'glass';

export interface UserProfile {
  name: string;
  email: string;
  companyName: string;
  industry: string;
  subscription: 'Free' | 'Pro Genie' | 'Enterprise';
  logoUrl?: string;
  settings: {
    notificationsEnabled: boolean;
    voiceEnabled: boolean;
    theme: Theme;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  files?: Array<{ name: string; type: string; size: number }>;
  isVoice?: boolean;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  invoiceId?: string;
  budgetId?: string;
}

export interface Budget {
  id: string;
  name: string;
  limit: number;
  spent: number;
  category: string;
  period: 'monthly' | 'yearly';
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  items: InvoiceItem[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'contacted' | 'customer';
  notes: string;
  lastInteraction: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  product: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface MarketingPost {
  id: string;
  platform: 'instagram' | 'linkedin' | 'facebook' | 'email' | 'seo' | 'ad';
  topic: string;
  content: string;
  date: string;
  status: 'draft' | 'scheduled' | 'published';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  salary: number;
  attendanceRate: number; // percentage
  leaveRemaining: number;
  joinDate: string;
}

export interface ResumeAnalysis {
  id: string;
  candidateName: string;
  targetRole: string;
  matchScore: number; // 0 - 100
  skillsFound: string[];
  strengths: string[];
  weaknesses: string[];
  extractedSummary: string;
  suggestedQuestions: string[];
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: string; // pdf, docx, xlsx, png, jpg
  size: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'failed';
  summary?: string;
  ocrText?: string;
  extractedFields?: Record<string, string>;
}

export interface BusinessHealth {
  score: number; // 0-100
  runwayMonths: number;
  growthRate: number; // percentage
  cashFlowRatio: number;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: 'finance' | 'marketing' | 'sales' | 'hr';
  }>;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  category: 'finance' | 'sales' | 'hr' | 'assistant' | 'general';
  priority: 'info' | 'warning' | 'urgent';
  timestamp: string;
  read: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: 'meeting' | 'finance' | 'deadline';
  description?: string;
}
