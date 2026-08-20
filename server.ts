import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client Lazily/Safely
let aiClient: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
    try {
      aiClient = new GoogleGenAI({
        apiKey: API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("✅ Gemini AI client initialized successfully.");
    } catch (err) {
      console.error("❌ Failed to initialize Gemini API Client:", err);
    }
  }
  return aiClient;
}

// Check if Gemini API key is configured
app.get("/api/gemini/status", (req, res) => {
  const isConfigured = !!API_KEY && API_KEY !== "MY_GEMINI_API_KEY";
  res.json({ configured: isConfigured });
});

// Helper for Mock/Fallback Gemini replies when no API key is set
const getFallbackChatResponse = (prompt: string, context: string): string => {
  const lower = prompt.toLowerCase();
  
  if (lower.includes("budget") || lower.includes("aws") || lower.includes("cloud")) {
    return `### 🧞‍♂️ BizGenie Financial Advisor Insight

I see you are asking about your **AWS / Infrastructure budgets**. 
Looking at your Zenith Tech Solutions ledger:
* **Monthly Infrastructure Limit**: **₹3,00,000**, with **₹1,45,000 (48%)** currently spent.
* AWS bills are rising at approximately **12% Month-over-Month**.

**Strategic Recommendations:**
1. **Spot Instances & Auto-scaling**: Transition non-critical generative caching nodes to Spot Instances. Reduces compute bills by up to **60%**.
2. **S3 Intelligent-Tiering**: Enable intelligent tiering on document buckets. Archiving old analyzed invoices saves up to **₹15,000/month**.
3. **Savings Plans**: Commit to a 1-year compute savings plan if your baseline stays steady.

*Would you like me to draft an infrastructure cost auditing checklist for your lead engineer?*`;
  }

  if (lower.includes("invoice") || lower.includes("algonquin") || lower.includes("overdue") || lower.includes("unpaid")) {
    return `### 🧞‍♂️ BizGenie Invoice Rescue Program

It looks like you're concerned about invoice **INV-2026-003** from **Algonquin Agency** for **₹32,000**, which is now overdue.

Here is a professional, high-converting payment reminder email draft:

\`\`\`
Subject: Payment Reminder: Invoice INV-2026-003 [Zenith Tech Solutions]

Dear Algonquin Accounts Team,

I hope you are doing well.

This is a gentle reminder that invoice INV-2026-003 for ₹32,000, issued on July 05, 2026, was due on July 20, 2026. According to our records, we have not yet received payment.

You can securely process this invoice via your direct portal or wire transfer. If payment has already been sent, please disregard this note and accept our thanks.

Thank you for your ongoing partnership.

Best regards,
Meghaa Raj
Founder, Zenith Tech Solutions
\`\`\`

*Would you like me to modify this draft or prepare a formal PDF reminder statement?*`;
  }

  if (lower.includes("linkedin") || lower.includes("marketing") || lower.includes("post") || lower.includes("social")) {
    return `### 🧞‍♂️ BizGenie Marketing Engine

Here is a high-impact, professional LinkedIn post designed for **Zenith Tech Solutions**:

🚀 **Deploying Generative AI at Scale: 3 Core Lessons We Learned**

Over the last month, the team at **Zenith Tech Solutions** scaled a customized, multi-endpoint GenAI pipeline. Here are our top architectural insights:

1️⃣ **Context Cost Deflation**: By caching embeddings and implementing recursive token truncation, we reduced runtime latency by 42%.
2️⃣ **Structured Output Guarantees**: We replaced sloppy prompt boundaries with strict JSON schema validations to ensure 100% compliant API responses.
3️⃣ **Secure Token Isolation**: Implemented a server-side proxy for all API operations, shielding credentials.

The result? 100% uptime and an instant 3.5x boost in workflow throughput.

🔗 Read our full case study or DM me to audit your AI Pipeline!

#GenerativeAI #SaaS #EnterpriseArchitecture #TechConsulting #ZenithTech`;
  }

  if (lower.includes("hiring") || lower.includes("recruit") || lower.includes("resume") || lower.includes("employee") || lower.includes("salary")) {
    return `### 🧞‍♂️ BizGenie HR & Talent Acquisition Strategy

Based on your current payroll and team structure at **Zenith Tech Solutions**:
* **Active Team**: 3 key members (Elena Fisher - Lead AI Engineer, Devon Carter - Growth Marketing, Sophia Lin - Technical PM).
* **Average Attendance Rate**: **96.9%** across engineering and product.

**Action Plan for New Hiring:**
1. **Define Core Competencies**: Screen for SaaS lifecycle experience and GenAI prompt engineering literacy.
2. **Competitive Compensation**: Standardize base salaries against regional market rates (₹12,00,000 - ₹18,00,000 PA).
3. **Structured Onboarding**: Deploy automated 14-day training modules.

*Would you like me to draft a complete Job Description or screen candidate resumes?*`;
  }

  if (lower.includes("profit") || lower.includes("margin") || lower.includes("revenue") || lower.includes("cash") || lower.includes("growth")) {
    return `### 🧞‍♂️ BizGenie Cashflow & Profitability Analysis

Here is a quick financial health analysis for **Zenith Tech Solutions**:
* **Total Gross Invoiced Income**: **₹2,62,500**
* **Operating Expenses**: **₹71,500**
* **Net Profit Margin**: **~72.7%** (Exemplary SaaS consulting margin!)
* **Net Cash Balance**: **₹1,91,000**
* **Outstanding Invoices**: **₹32,000** (Algonquin Agency)

**Optimization Recommendations:**
1. **Recover Overdue Invoices**: Collecting the ₹32,000 overdue invoice will boost cash reserves by **16.7%**.
2. **Reinvest Profits**: Allocate 15-20% of net margin into targeted LinkedIn lead generation ads.`;
  }

  // General doubt/task handler
  return `### 🧞‍♂️ BizGenie AI Co-Pilot Task Execution

I have processed your request: **"${prompt}"**

**Analysis & Strategic Action Steps for Zenith Tech Solutions:**

1. **Immediate Execution Plan**:
   - Analyzed query against live workspace metrics (₹2,62,500 revenue, ₹71,500 expenses, 4 active client accounts).
   - Identified primary operational levers to resolve this task effectively.

2. **Core Guidance & Resolution**:
   - **Strategy**: Implement structured tracking and clear milestones.
   - **Efficiency**: Leverage automated workflows to minimize manual overhead.
   - **Impact**: Ensure alignment with your overall Q3 growth objectives and client SLAs (Nexus Global, Starlight Retail).

3. **Recommended Next Steps**:
   - Would you like me to draft a formal proposal, write an email communication, or calculate detailed ROI projections for this task?

*Feel free to specify additional requirements or ask follow-up questions!*`;
};

// 1. ChatGPT-like Assistant Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { prompt, threadHistory, context } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Return high-quality mock response
    const reply = getFallbackChatResponse(prompt, JSON.stringify(context));
    return res.json({ reply, mode: 'simulated' });
  }

  try {
    const formattedHistory = (threadHistory || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Ingest rich operational context as a system instruction
    const systemInstruction = `
      You are "BizGenie AI", a highly sophisticated, SaaS-oriented, intelligent business companion and virtual COO.
      Your tone is professional, strategic, structured, and helpful—resembling the style of a premium business consultant or financial advisor.
      Use Markdown formatting (bullet points, bold text, headers, and code blocks) to make your output visually pleasing.
      You are helping a business owner named "Meghaa Raj" who runs "Zenith Tech Solutions", an AI & Software Services firm.
      
      Here is the exact real-time operational context of the business:
      ${JSON.stringify(context)}
      
      Integrate these real metrics (revenue, expenses, active leads, invoices, budgets, health score) into your replies when answering financial, operational, or client-related queries.
      Never refer to yourself as a general AI. You are BizGenie AI. Give concrete, mathematical, and actionable advice.
    `;

    // Append the current message
    formattedHistory.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || getFallbackChatResponse(prompt, JSON.stringify(context));
    res.json({ reply, mode: 'live' });
  } catch (err: any) {
    console.error("Gemini Chat Error:", err);
    const reply = getFallbackChatResponse(prompt, JSON.stringify(context));
    res.json({ reply, mode: 'fallback', details: err.message });
  }
});

// 2. Marketing AI Post Generator Endpoint
app.post("/api/gemini/generate-marketing", async (req, res) => {
  const { topic, platform, details, tone } = req.body;
  const client = getGeminiClient();

  const prompt = `
    Generate a highly engaging, high-conversion ${platform} post or content on the topic "${topic}".
    Platform specifications: ${platform}.
    Audience context/Specific details: ${details}.
    Target Tone of voice: ${tone || 'professional, expert'}.
    
    Format the response in neat Markdown. Provide appropriate hashtags, a powerful hooks section, body paragraphs, and a clear Call to Action (CTA).
  `;

  if (!client) {
    const defaultResponse = `### 🧞‍♂️ BizGenie AI Marketing Engine [Simulated Mode]

Here is your customized **${platform.toUpperCase()} Campaign** copy:

**🎯 Dynamic Hook:**
"${topic.includes('AI') ? 'Are you still manually managing workflows in 2026?' : 'The business landscape is shifting rapidly.'} Here is how we scaled zenith efficiency."

**📝 Body Paragraphs:**
${details || 'Establishing proper operational pipelines is the single biggest factor separating high-growth startups from struggling ones.'} 

By leveraging automated client pipelines, we saved over 20+ resource hours per week. Here are the 3 actions you can take today:
1.  **Map out repetitive tasks**: Identify administrative or entry choke points.
2.  **Deploy AI proxies**: Automate invoice drafting and draft follow-ups.
3.  **Harness data aggregation**: Maintain unified analytics.

**💡 Call to Action (CTA):**
🚀 Ready to take Zenith Tech Solutions to the next level? DM me or comment below to get our exclusive framework sheet!

#${platform}Marketing #ZenithTechSolutions #BusinessGrowth #SaaSStrategy #Automation`;
    
    return res.json({ content: defaultResponse, mode: 'simulated' });
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are BizGenie's copywriter and digital strategist. You write highly engaging, professional marketing materials that maximize engagement and click-through rates.",
        temperature: 0.8
      }
    });
    const content = response.text || "Generated marketing campaign outline successfully.";
    res.json({ content, mode: 'live' });
  } catch (err: any) {
    console.error("Marketing Gen Error:", err);
    res.json({ 
      content: `### 🧞‍♂️ BizGenie AI Marketing Engine
      
Here is your customized **${platform.toUpperCase()} Campaign** copy for **${topic}**:

**🎯 Dynamic Hook:**
"Are you still handling ${topic} manually in 2026? Here is how we automated our pipeline."

**📝 Key Insights:**
1. **Streamline Operations**: Save resource hours by standardizing templates.
2. **Data Integrity**: Eliminate manual entry mistakes.
3. **Scale Conversion**: Engage key decision-makers directly.

#${platform} #ZenithTechSolutions #BusinessGrowth`, 
      mode: 'fallback' 
    });
  }
});

// 3. Resume Screen & Interview Question Generator Endpoint
app.post("/api/gemini/screen-resume", async (req, res) => {
  const { candidateName, targetRole, skills, experienceText } = req.body;
  const client = getGeminiClient();

  const prompt = `
    Screen this candidate resume for the target role: "${targetRole}".
    Candidate Name: "${candidateName}".
    Declared Skills: "${skills}".
    Resume Text / Experience summary: "${experienceText}".

    Conduct a strict analysis and output your evaluation. Provide:
    1. A Suitability Match Score (integer from 0 to 100).
    2. A bulleted list of 3-4 Key Strengths.
    3. A bulleted list of 2-3 Weaknesses or Gaps.
    4. An executive resume summary.
    5. A list of 4 highly technical, tailor-made Interview Questions to ask this candidate based on their background.

    Ensure you format this as a JSON object with this exact shape:
    {
      "candidateName": string,
      "targetRole": string,
      "matchScore": number,
      "skillsFound": string[],
      "strengths": string[],
      "weaknesses": string[],
      "extractedSummary": string,
      "suggestedQuestions": string[]
    }
  `;

  if (!client) {
    const mockAnalysis = {
      candidateName: candidateName || "Alexander Rivera",
      targetRole: targetRole || "Senior Frontend React Engineer",
      matchScore: 84,
      skillsFound: (skills || "React, TypeScript, Redux, Tailwind, Node.js").split(',').map(s => s.trim()),
      strengths: [
        "Deep technical experience with advanced React 18 patterns & hooks architecture",
        "Expertise in designing high-performance component state engines & WebSockets",
        "Proven experience leading agile engineering units of 4+ developers"
      ],
      weaknesses: [
        "Limited experience with native mobile app deployment (Flutter/Swift)",
        "Few metrics demonstrating direct ownership of conversion optimizations"
      ],
      extractedSummary: `${candidateName || "Alexander"} is a highly skilled developer with 5+ years of production experience scaling SaaS platforms. Excellent typography pairing, design system knowledge, and robust testing standards.`,
      suggestedQuestions: [
        `Can you describe how you would resolve infinite re-renders inside a custom React useEffect hook that depends on non-primitive objects?`,
        `How do you handle WebSocket connection retries under aggressive browser throttling on mobile?`,
        `Describe a scenario where you had to refactor a massive Redux store into modular Contexts to boost performance.`
      ]
    };
    return res.json({ data: mockAnalysis, mode: 'simulated' });
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["candidateName", "targetRole", "matchScore", "skillsFound", "strengths", "weaknesses", "extractedSummary", "suggestedQuestions"],
          properties: {
            candidateName: { type: Type.STRING },
            targetRole: { type: Type.STRING },
            matchScore: { type: Type.INTEGER },
            skillsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            extractedSummary: { type: Type.STRING },
            suggestedQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ data: parsedData, mode: 'live' });
  } catch (err: any) {
    console.error("Resume screening error:", err);
    const mockAnalysis = {
      candidateName: candidateName || "Applicant",
      targetRole: targetRole || "Role Candidate",
      matchScore: 82,
      skillsFound: (skills || "Problem Solving, Communication, Teamwork").split(',').map(s => s.trim()),
      strengths: [
        "Solid background in technical delivery and task execution",
        "Strong team collaboration and communication skills"
      ],
      weaknesses: [
        "Requires further technical screening during live interview"
      ],
      extractedSummary: "Candidate demonstrates relevant expertise for this position.",
      suggestedQuestions: [
        "Describe your most challenging recent technical project.",
        "How do you prioritize competing deadlines?"
      ]
    };
    res.json({ data: mockAnalysis, mode: 'fallback' });
  }
});

// 4. Document Intelligence Parser Endpoint
app.post("/api/gemini/parse-document", async (req, res) => {
  const { fileName, fileType, textContent } = req.body;
  const client = getGeminiClient();

  const prompt = `
    Analyze this document: "${fileName}" (Type: ${fileType}).
    Document content summary: "${textContent || 'Standard business ledger/statement'}".

    Extract:
    1. A clear 3-sentence summary of the document.
    2. Simulated OCR full text reconstruction.
    3. 3-4 structural Key-Value fields extracted from the text (e.g. Invoice amount, contractor names, billing date).

    Return a JSON response matching:
    {
      "summary": string,
      "ocrText": string,
      "extractedFields": { [key: string]: string }
    }
  `;

  if (!client) {
    const mockDocAnalysis = {
      summary: `This is an analyzed summary report of "${fileName}". It contains transactional breakdowns, company information, and operating policies. All critical figures have been structured correctly.`,
      ocrText: `DOCUMENT PARSED SUCCESSFULLY: [${fileName.toUpperCase()}] \nDate: 2026-07-21\nEntity: Zenith Tech Solutions\nStatus: Verified\nContent: Standard enterprise records indicating positive margins, high consulting conversion rates, and robust cloud scaling configurations. No violations found.`,
      extractedFields: {
        'Document Name': fileName,
        'File Format': fileType.toUpperCase(),
        'Processing Status': 'SUCCESS (OCR Confirmed)',
        'Metadata Ingestion': 'Zenith Consulting Store'
      }
    };
    return res.json({ data: mockDocAnalysis, mode: 'simulated' });
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["summary", "ocrText", "extractedFields"],
          properties: {
            summary: { type: Type.STRING },
            ocrText: { type: Type.STRING },
            extractedFields: { 
              type: Type.OBJECT,
              description: "Extracted key-value strings from the parsed document"
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text);
    res.json({ data: parsedData, mode: 'live' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to list and read all Flutter files
app.get("/api/flutter/files", (req, res) => {
  const flutterDir = path.join(process.cwd(), 'flutter_app');
  const filesList: { path: string; name: string; category: string; content: string }[] = [];

  function scanDir(dir: string, baseRelative = '') {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = baseRelative ? `${baseRelative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        scanDir(fullPath, relPath);
      } else if (entry.isFile() && (entry.name.endsWith('.dart') || entry.name.endsWith('.yaml') || entry.name.endsWith('.md'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          let category = 'Root';
          if (relPath.includes('screens')) category = 'Screens (UI)';
          else if (relPath.includes('models')) category = 'Models & Types';
          else if (relPath.includes('services')) category = 'Services & State';
          filesList.push({
            path: relPath,
            name: entry.name,
            category,
            content
          });
        } catch (e) {
          // ignore unreadable
        }
      }
    }
  }

  scanDir(flutterDir);
  res.json({ files: filesList });
});

// Full-Stack serving setup (Express + Vite)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("🛠️ Vite Dev Server middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("📦 Production static assets mounted.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 BizGenie AI server running on http://localhost:${PORT}`);
  });
}

startServer();
