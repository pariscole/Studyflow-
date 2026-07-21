import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  HelpCircle,
  FileText,
  Calendar,
  Flame,
  BookOpen,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Bot,
  User,
} from 'lucide-react';
import { ChatMessage, Course, StudentProfile } from '../../types';

interface AiAssistantViewProps {
  profile: StudentProfile;
  courses: Course[];
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ profile, courses }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `### 👋 Hi ${profile.name.split(' ')[0]}! I'm StudyFlow AI.

I am your personal 24/7 academic tutor and study strategist. How can I help you today?

Pick a quick tool below or type your question!`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickTools = [
    {
      id: 'concept',
      label: 'Explain Difficult Concept',
      icon: HelpCircle,
      prompt: 'Can you explain Red-Black tree self-balancing rotations using a simple real-world analogy?',
      color: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    },
    {
      id: 'quiz',
      label: 'Generate Practice Quiz',
      icon: Zap,
      prompt: 'Generate a 3-question multiple choice practice quiz on Linear Algebra eigenvalues and eigenvectors.',
      color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    },
    {
      id: 'summary',
      label: 'Summarize Notes',
      icon: FileText,
      prompt: 'Summarize key takeaways for Monetary Policy interest rate inflation controls into 3 flashcards.',
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    {
      id: 'plan',
      label: 'Suggest Study Plan',
      icon: Calendar,
      prompt: 'Create a 3-hour weekend study plan to prepare for my Data Structures midterm exam.',
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    {
      id: 'motivation',
      label: 'Motivation Boost',
      icon: Flame,
      prompt: 'I feel overwhelmed with assignments today. Give me an inspiring kickstart plan to overcome procrastination.',
      color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    },
    {
      id: 'techniques',
      label: 'Recommend Study Techniques',
      icon: BookOpen,
      prompt: 'What are the top 3 active recall techniques for memorizing computer science algorithms efficiently?',
      color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string, mode?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          mode: mode || 'general',
          context: {
            studentName: profile.name,
            major: profile.major,
            courses: courses.map((c) => c.name),
          },
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I've processed your study request!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: data.mode,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('AI chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `### 🎓 Study Tip for: ${messageText}\n\n1. **Break it down**: Divide this topic into 20-minute active recall blocks.\n2. **Self-Test**: Explain the concept out loud in 2 sentences.\n3. **Review**: Recheck your formula sheet or notes!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 text-white shadow-xl shadow-purple-500/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">AI Study Assistant</h1>
            <p className="text-xs text-purple-100">
              Powered by Gemini 3.6 Flash • Ask questions, solve problems, generate quizzes
            </p>
          </div>
        </div>
      </div>

      {/* Quick Tool Prompt Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Quick AI Study Tools
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleSendMessage(tool.prompt, tool.id)}
                className={`p-3 rounded-2xl border text-left transition-all hover:scale-105 active:scale-95 space-y-2 ${tool.color}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-extrabold text-xs block leading-tight">{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-4 sm:p-6 shadow-sm min-h-[420px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isAi ? '' : 'flex-row-reverse space-x-reverse'}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-sm ${
                  isAi ? 'bg-gradient-to-tr from-purple-600 to-sky-500' : 'bg-slate-800 dark:bg-slate-700'
                }`}
              >
                {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl space-y-2 relative group ${
                  isAi
                    ? 'bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-slate-700/60'
                    : 'bg-sky-600 text-white rounded-tr-none'
                }`}
              >
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between text-[10px] opacity-60 pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                  <span>{msg.timestamp}</span>
                  {isAi && (
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="hover:text-purple-500 flex items-center space-x-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-3 text-xs text-slate-400 p-2">
            <div className="w-8 h-8 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center animate-spin">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-semibold text-slate-500 animate-pulse">
              StudyFlow AI is analyzing your prompt...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI anything (e.g., 'Explain Big-O time complexity with code examples')..."
          className="flex-1 px-4 py-3 bg-transparent text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-sky-500 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center space-x-1.5 shadow-md shadow-purple-500/20"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
