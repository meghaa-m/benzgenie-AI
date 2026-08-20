class UserProfile {
  String name;
  String email;
  String companyName;
  String industry;
  String subscription;
  String? logoUrl;
  bool notificationsEnabled;
  bool voiceEnabled;
  String theme;

  UserProfile({
    required this.name,
    required this.email,
    required this.companyName,
    required this.industry,
    required this.subscription,
    this.logoUrl,
    required this.notificationsEnabled,
    required this.voiceEnabled,
    required this.theme,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      companyName: json['companyName'] ?? '',
      industry: json['industry'] ?? '',
      subscription: json['subscription'] ?? 'Free',
      logoUrl: json['logoUrl'],
      notificationsEnabled: json['notificationsEnabled'] ?? true,
      voiceEnabled: json['voiceEnabled'] ?? true,
      theme: json['theme'] ?? 'dark',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'companyName': companyName,
      'industry': industry,
      'subscription': subscription,
      'logoUrl': logoUrl,
      'notificationsEnabled': notificationsEnabled,
      'voiceEnabled': voiceEnabled,
      'theme': theme,
    };
  }
}

class ChatMessage {
  final String id;
  final String role; // 'user' or 'model'
  final String content;
  final String timestamp;
  final bool? isVoice;

  ChatMessage({
    required this.id,
    required this.role,
    required this.content,
    required this.timestamp,
    this.isVoice,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'] ?? '',
      role: json['role'] ?? 'user',
      content: json['content'] ?? '',
      timestamp: json['timestamp'] ?? '',
      isVoice: json['isVoice'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'role': role,
      'content': content,
      'timestamp': timestamp,
      'isVoice': isVoice,
    };
  }
}

class ChatThread {
  final String id;
  final String title;
  final List<ChatMessage> messages;
  final String updatedAt;

  ChatThread({
    required this.id,
    required this.title,
    required this.messages,
    required this.updatedAt,
  });

  factory ChatThread.fromJson(Map<String, dynamic> json) {
    var list = json['messages'] as List? ?? [];
    List<ChatMessage> msgs = list.map((i) => ChatMessage.fromJson(i)).toList();
    return ChatThread(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      messages: msgs,
      updatedAt: json['updatedAt'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'messages': messages.map((m) => m.toJson()).toList(),
      'updatedAt': updatedAt,
    };
  }
}

class Transaction {
  final String id;
  final String date;
  final String description;
  final String type; // 'income' or 'expense'
  final double amount;
  final String category;

  Transaction({
    required this.id,
    required this.date,
    required this.description,
    required this.type,
    required this.amount,
    required this.category,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] ?? '',
      date: json['date'] ?? '',
      description: json['description'] ?? '',
      type: json['type'] ?? 'income',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      category: json['category'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': date,
      'description': description,
      'type': type,
      'amount': amount,
      'category': category,
    };
  }
}

class Budget {
  final String id;
  final String name;
  final double limit;
  double spent;
  final String category;
  final String period; // 'monthly' or 'yearly'

  Budget({
    required this.id,
    required this.name,
    required this.limit,
    required this.spent,
    required this.category,
    required this.period,
  });

  factory Budget.fromJson(Map<String, dynamic> json) {
    return Budget(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      limit: (json['limit'] as num?)?.toDouble() ?? 0.0,
      spent: (json['spent'] as num?)?.toDouble() ?? 0.0,
      category: json['category'] ?? '',
      period: json['period'] ?? 'monthly',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'limit': limit,
      'spent': spent,
      'category': category,
      'period': period,
    };
  }
}

class InvoiceItem {
  final String description;
  final int quantity;
  final double unitPrice;
  final double amount;

  InvoiceItem({
    required this.description,
    required this.quantity,
    required this.unitPrice,
    required this.amount,
  });

  factory InvoiceItem.fromJson(Map<String, dynamic> json) {
    return InvoiceItem(
      description: json['description'] ?? '',
      quantity: json['quantity'] as int? ?? 1,
      unitPrice: (json['unitPrice'] as num?)?.toDouble() ?? 0.0,
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'description': description,
      'quantity': quantity,
      'unitPrice': unitPrice,
      'amount': amount,
    };
  }
}

class Invoice {
  final String id;
  final String invoiceNo;
  final String clientName;
  final String clientEmail;
  final double amount;
  final String issueDate;
  final String dueDate;
  final String status; // 'paid' | 'pending' | 'overdue'
  final List<InvoiceItem> items;

  Invoice({
    required this.id,
    required this.invoiceNo,
    required this.clientName,
    required this.clientEmail,
    required this.amount,
    required this.issueDate,
    required this.dueDate,
    required this.status,
    required this.items,
  });

  factory Invoice.fromJson(Map<String, dynamic> json) {
    var itemsList = json['items'] as List? ?? [];
    List<InvoiceItem> parsedItems = itemsList.map((i) => InvoiceItem.fromJson(i)).toList();
    return Invoice(
      id: json['id'] ?? '',
      invoiceNo: json['invoiceNo'] ?? '',
      clientName: json['clientName'] ?? '',
      clientEmail: json['clientEmail'] ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      issueDate: json['issueDate'] ?? '',
      dueDate: json['dueDate'] ?? '',
      status: json['status'] ?? 'pending',
      items: parsedItems,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'invoiceNo': invoiceNo,
      'clientName': clientName,
      'clientEmail': clientEmail,
      'amount': amount,
      'issueDate': issueDate,
      'dueDate': dueDate,
      'status': status,
      'items': items.map((i) => i.toJson()).toList(),
    };
  }
}

class Customer {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String company;
  final String status; // 'lead' | 'contacted' | 'customer'
  final String notes;
  final String lastInteraction;

  Customer({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.company,
    required this.status,
    required this.notes,
    required this.lastInteraction,
  });

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      company: json['company'] ?? '',
      status: json['status'] ?? 'lead',
      notes: json['notes'] ?? '',
      lastInteraction: json['lastInteraction'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'company': company,
      'status': status,
      'notes': notes,
      'lastInteraction': lastInteraction,
    };
  }
}

class Order {
  final String id;
  final String customerId;
  final String customerName;
  final String product;
  final double amount;
  final String date;
  final String status; // 'pending' | 'completed' | 'cancelled'

  Order({
    required this.id,
    required this.customerId,
    required this.customerName,
    required this.product,
    required this.amount,
    required this.date,
    required this.status,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] ?? '',
      customerId: json['customerId'] ?? '',
      customerName: json['customerName'] ?? '',
      product: json['product'] ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      date: json['date'] ?? '',
      status: json['status'] ?? 'pending',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customerId': customerId,
      'customerName': customerName,
      'product': product,
      'amount': amount,
      'date': date,
      'status': status,
    };
  }
}

class MarketingPost {
  final String id;
  final String platform;
  final String topic;
  final String content;
  final String date;
  final String status; // 'draft' | 'scheduled' | 'published'

  MarketingPost({
    required this.id,
    required this.platform,
    required this.topic,
    required this.content,
    required this.date,
    required this.status,
  });

  factory MarketingPost.fromJson(Map<String, dynamic> json) {
    return MarketingPost(
      id: json['id'] ?? '',
      platform: json['platform'] ?? 'linkedin',
      topic: json['topic'] ?? '',
      content: json['content'] ?? '',
      date: json['date'] ?? '',
      status: json['status'] ?? 'draft',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'platform': platform,
      'topic': topic,
      'content': content,
      'date': date,
      'status': status,
    };
  }
}

class Employee {
  final String id;
  final String name;
  final String role;
  final String department;
  final String email;
  final double salary;
  final double attendanceRate;
  final int leaveRemaining;
  final String joinDate;

  Employee({
    required this.id,
    required this.name,
    required this.role,
    required this.department,
    required this.email,
    required this.salary,
    required this.attendanceRate,
    required this.leaveRemaining,
    required this.joinDate,
  });

  factory Employee.fromJson(Map<String, dynamic> json) {
    return Employee(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      role: json['role'] ?? '',
      department: json['department'] ?? '',
      email: json['email'] ?? '',
      salary: (json['salary'] as num?)?.toDouble() ?? 0.0,
      attendanceRate: (json['attendanceRate'] as num?)?.toDouble() ?? 100.0,
      leaveRemaining: json['leaveRemaining'] as int? ?? 15,
      joinDate: json['joinDate'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'role': role,
      'department': department,
      'email': email,
      'salary': salary,
      'attendanceRate': attendanceRate,
      'leaveRemaining': leaveRemaining,
      'joinDate': joinDate,
    };
  }
}

class DocumentRecord {
  final String id;
  final String name;
  final String type;
  final String size;
  final String uploadDate;
  final String status; // 'processing' | 'completed' | 'failed'
  final String? summary;

  DocumentRecord({
    required this.id,
    required this.name,
    required this.type,
    required this.size,
    required this.uploadDate,
    required this.status,
    this.summary,
  });

  factory DocumentRecord.fromJson(Map<String, dynamic> json) {
    return DocumentRecord(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] ?? 'pdf',
      size: json['size'] ?? '0 KB',
      uploadDate: json['uploadDate'] ?? '',
      status: json['status'] ?? 'completed',
      summary: json['summary'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'size': size,
      'uploadDate': uploadDate,
      'status': status,
      'summary': summary,
    };
  }
}

class AppNotification {
  final String id;
  final String title;
  final String description;
  final String category;
  final String priority;
  final String timestamp;
  bool read;

  AppNotification({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.priority,
    required this.timestamp,
    required this.read,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? 'general',
      priority: json['priority'] ?? 'info',
      timestamp: json['timestamp'] ?? '',
      read: json['read'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'priority': priority,
      'timestamp': timestamp,
      'read': read,
    };
  }
}

class CalendarEvent {
  final String id;
  final String title;
  final String date;
  final String time;
  final String category;
  final String? description;

  CalendarEvent({
    required this.id,
    required this.title,
    required this.date,
    required this.time,
    required this.category,
    this.description,
  });

  factory CalendarEvent.fromJson(Map<String, dynamic> json) {
    return CalendarEvent(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      date: json['date'] ?? '',
      time: json['time'] ?? '',
      category: json['category'] ?? 'meeting',
      description: json['description'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'date': date,
      'time': time,
      'category': category,
      'description': description,
    };
  }
}
