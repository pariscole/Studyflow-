import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Initialize Gemini client server-side
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", geminiConfigured: !!apiKey, timestamp: new Date().toISOString() });
  });

  // System Engineering Telemetry & Observability Endpoint
  app.get("/api/system/telemetry", (_req, res) => {
    const memory = process.memoryUsage();
    res.json({
      status: "operational",
      serverTimestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        heapUsedMB: Number((memory.heapUsed / 1024 / 1024).toFixed(2)),
        heapTotalMB: Number((memory.heapTotal / 1024 / 1024).toFixed(2)),
        rssMB: Number((memory.rss / 1024 / 1024).toFixed(2)),
      },
      services: {
        aiGateway: apiKey ? "online" : "fallback_mode",
        storageEngine: "localstorage_synchronized",
        webServer: "express_vite_middleware",
      },
      architecture: "Client SPA + Node.js/Express Proxy API + Gemini AI",
    });
  });

  // AI Chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, mode = "general", context } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      // If Gemini client is available, call model
      if (ai) {
        let systemPrompt = `You are StudyFlow AI, an empathetic, encouraging, and highly effective academic mentor and tutor for college students.
Your goal is to reduce study stress, explain complex subjects simply using analogies, build effective study schedules, generate quizzes, and boost productivity.
Keep formatting clean with clear headings, bullet points, and actionable tips.`;

        if (mode === "concept") {
          systemPrompt += `\nFocus on explaining difficult academic concepts clearly with simple real-world analogies, step-by-step breakdowns, and key terms highlighted.`;
        } else if (mode === "quiz") {
          systemPrompt += `\nFocus on generating a 3-question multiple choice or short answer practice quiz with immediate feedback and detailed explanation for each answer.`;
        } else if (mode === "summary") {
          systemPrompt += `\nFocus on summarizing student notes into key takeaways, bullet points, and 3-5 flashcard Q&As.`;
        } else if (mode === "plan") {
          systemPrompt += `\nFocus on constructing an actionable study plan with time blocking, priority ranking, and break recommendations.`;
        } else if (mode === "motivation") {
          systemPrompt += `\nProvide an inspiring, energetic, and practical motivational boost with an actionable tip for defeating procrastination.`;
        } else if (mode === "techniques") {
          systemPrompt += `\nRecommend specific evidence-based learning methods (e.g. Active Recall, Feynman Technique, Pomodoro 50/10, Spaced Repetition, Blurting) with instructions on how to apply them to this subject.`;
        }

        if (context) {
          systemPrompt += `\nStudent Context: ${JSON.stringify(context)}`;
        }

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: message,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        const reply = response.text || "I've analyzed your request and prepared these study recommendations!";
        return res.json({ reply, mode, source: "gemini" });
      }

      // Intelligent Fallback Generator if API key is not present
      const fallbackReply = generateFallbackAIResponse(message, mode, context);
      return res.json({ reply: fallbackReply, mode, source: "fallback" });
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      // Fallback on error to ensure smooth experience
      const fallbackReply = generateFallbackAIResponse(req.body.message || "", req.body.mode || "general", req.body.context);
      return res.json({ reply: fallbackReply, mode: req.body.mode, source: "fallback-error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyFlow server running on http://0.0.0.0:${PORT}`);
  });
}

function generateFallbackAIResponse(prompt: string, mode: string, context?: any): string {
  const p = prompt.toLowerCase();

  if (mode === "concept" || p.includes("explain") || p.includes("what is") || p.includes("how does")) {
    return `### 💡 Concept Breakdown: ${prompt}

Here is a simplified explanation to master this topic:

1. **The Big Picture Idea**:
   Think of this concept like a well-organized library system. Core elements interact in structured loops to achieve balance and efficiency.

2. **3 Key Pillars**:
   - **Core Definition**: The primary mechanism that drives the process.
   - **Application**: Where this principle appears in real-world problems and exam questions.
   - **Common Pitfall**: Students often confuse the input triggers with output results. Make sure to track causal order!

3. **Real-World Analogy**:
   Imagine building a bridge: the foundational pillars (the theory) support the roadway (the application). Without checking structural tension (active review), weak spots form before exam day!

*Pro Tip: Try explaining this in 2 sentences to a friend without looking at your notes (The Feynman Technique)!*`;
  }

  if (mode === "quiz" || p.includes("quiz") || p.includes("question") || p.includes("test")) {
    return `### 📝 Practice Quiz: Check Your Understanding

**Q1. What is the primary purpose of Active Recall in long-term memory retention?**
- A) Passively reading notes 3 times
- B) Retrieving information from memory without looking at hints
- C) Highlighting text with bright colors
- D) Listening to ambient music while studying
*Answer: B. Retrieving information builds neural pathways and reveals knowledge gaps instantly.*

---

**Q2. Which study schedule method minimizes the testing effect decay curve?**
- A) Cramming 8 hours the night before
- B) Spaced Repetition across increasing intervals
- C) Studying only on weekends
- D) Memorizing definitions alphabetically
*Answer: B. Spaced Repetition combats Ebbinghaus's forgetting curve.*

---

**Q3. Quick Recall Challenge:**
Write down 3 key formulas or concepts from your recent lecture right now from memory!`;
  }

  if (mode === "summary" || p.includes("summarize") || p.includes("notes") || p.includes("key points")) {
    return `### 📌 Smart Summary & Key Takeaways

**Core Overview**:
This topic focuses on mastering foundational principles, identifying key variables, and solving structured problem sets efficiently.

**3 Key Takeaways**:
- **Principle #1**: Always start by listing known inputs before computing outcomes.
- **Principle #2**: Master the relationship between structural inputs and resulting formulas.
- **Principle #3**: Review past assignment errors—80% of exam variations come from missed homework edge cases.

**Flashcard Prep**:
- **Q**: What is the most critical variable to solve first?
- **A**: The primary rate or coefficient given in the problem statement.`;
  }

  if (mode === "plan" || p.includes("plan") || p.includes("schedule") || p.includes("study plan")) {
    return `### 📅 Customized Study Plan

**Recommended Allocation (Total: 3 Hours)**:
- ⏱️ **Block 1 (45 mins)**: Review high-yield lecture slides & solve 3 sample problems.
- ☕ **Break (10 mins)**: Walk away, stretch, hydrate!
- ⏱️ **Block 2 (45 mins)**: Active Recall flashcards & practice quiz set.
- ☕ **Break (10 mins)**: Quick mind refresh.
- ⏱️ **Block 3 (45 mins)**: Summarize weak spots & outline potential exam questions.
- ⏱️ **Wrap Up (15 mins)**: Log study hours into StudyFlow!`;
  }

  if (mode === "motivation" || p.includes("motivate") || p.includes("procrastinat") || p.includes("stress")) {
    return `### 🔥 You've Got This!

> *"Success is the sum of small efforts, repeated day in and day out."*

Remember why you started this semester! You don't have to conquer the entire syllabus today—you just need to tackle **one 25-minute study sprint**. 

**Your 5-Minute Action Step**:
Clear your desk, set a timer for 15 minutes, and start with the easiest task on your checklist. Once momentum kicks in, focus will follow naturally! 🚀`;
  }

  if (mode === "techniques" || p.includes("technique") || p.includes("method") || p.includes("how to study")) {
    return `### 🎯 Recommended Study Technique: The Feynman Technique + Pomodoro

1. **Choose a Target Concept**: Select a topic you feel shaky on from your course.
2. **Teach It To a 12-Year-Old**: Explain it out loud using plain language without jargon.
3. **Identify Knowledge Gaps**: Whenever you stumble or rely on complex terminology, go back to your notes to fill the gap.
4. **Simplify & Use Analogies**: Refine your explanation until it flows effortlessly.

**Structure**: Combine with 50-minute focused deep work blocks followed by 10-minute active breaks!`;
  }

  return `### 🎓 StudyFlow AI Assistant

I am here to help you study smarter and stress less! 

Here are some ways we can work together:
- **Concept Explanations**: Ask me to break down difficult topics or formulas.
- **Practice Quizzes**: Let's test your knowledge before upcoming exams.
- **Note Summaries**: Paste your notes and I'll generate key bullet points.
- **Study Plans**: Give me your assignment deadlines and I'll craft a weekly roadmap.
- **Motivation Boost**: Get energized and beat procrastination!

What subject or assignment are we working on right now?`;
}

startServer();
