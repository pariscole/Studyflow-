import React from 'react';
import {
  Sparkles,
  BookOpen,
  Calendar,
  CheckSquare,
  GraduationCap,
  LineChart,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Award,
  Star,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { ViewMode } from '../../types';

interface LandingViewProps {
  onGetStarted: () => void;
  setCurrentView: (view: ViewMode) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onGetStarted, setCurrentView }) => {
  const features = [
    {
      title: 'AI Study Assistant',
      desc: 'Ask complex course questions, generate practice quizzes, and summarize lecture notes in seconds.',
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300',
    },
    {
      title: 'Course Hub',
      desc: 'Track grades, credits, instructors, and class schedules for all your semester subjects in one clean dashboard.',
      icon: BookOpen,
      color: 'bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300',
    },
    {
      title: 'Assignment Tracker',
      desc: 'Organize homework, labs, and term papers with priority tags, course filters, and due date countdowns.',
      icon: CheckSquare,
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    {
      title: 'Interactive Study Planner',
      desc: 'Time-block your study sessions across Mon-Sun to maximize focus and build sustainable study habits.',
      icon: Calendar,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300',
    },
    {
      title: 'Exam Countdown & Checklists',
      desc: 'Beat exam anxiety with readiness indicators, study topic checklists, and real-time countdown timers.',
      icon: GraduationCap,
      color: 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300',
    },
    {
      title: 'Progress Analytics & GPA Goals',
      desc: 'Visualize weekly study hours, course performance trends, and unlock productivity streak badges.',
      icon: LineChart,
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300',
    },
  ];

  const stats = [
    { label: 'Average GPA Increase', value: '+0.4', highlight: 'Across 12,000+ students' },
    { label: 'Study Stress Reduced', value: '87%', highlight: 'Fewer missed deadlines' },
    { label: 'Weekly Hours Saved', value: '5.2 hrs', highlight: 'Through smart planning' },
    { label: 'Active College Users', value: '45,000+', highlight: 'At 150+ universities' },
  ];

  const testimonials = [
    {
      quote: "StudyFlow transformed my Junior year! I went from constantly drowning in assignments to having my entire week mapped out effortlessly.",
      author: "Maya Lin",
      role: "Computer Science Major, UC Berkeley",
      rating: 5,
    },
    {
      quote: "The AI Study Assistant generates practice quizzes before my Linear Algebra exams. My grade jumped from a B- to a solid A!",
      author: "Julian Vance",
      role: "Pre-Med Student, Michigan State",
      rating: 5,
    },
    {
      quote: "Finally, an app that feels friendly and motivating rather than rigid corporate software. The dark mode and streak badges keep me hooked!",
      author: "Sarah Jenkins",
      role: "Business & Econ Major, NYU",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50 via-purple-50/50 to-white dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900 p-8 sm:p-12 lg:p-16 border border-sky-100/80 dark:border-slate-800 text-center shadow-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-sky-200 dark:border-slate-700 shadow-sm text-xs font-semibold text-sky-600 dark:text-sky-300 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>AI-Powered College Success Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]">
            Study Smarter. <br />
            <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Stress Less.
            </span>{' '}
            Reach Your Goals.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Organize your courses, assignments, exams, and study sessions in one AI-powered workspace designed for college success.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white font-bold text-base shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>Open My Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentView('ai-assistant')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-base border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>Try AI Study Assistant</span>
            </button>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Free for College Students</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Browser Local Storage Sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm text-center hover:border-sky-200 dark:hover:border-sky-800 transition-all"
          >
            <p className="text-3xl sm:text-4xl font-extrabold text-sky-600 dark:text-sky-400">{stat.value}</p>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">{stat.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.highlight}</p>
          </div>
        ))}
      </section>

      {/* Features Grid Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Everything You Need for Academic Excellence
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Designed to bring clarity, motivation, and structure to your semester.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Loved by Students Across Campus
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            See how StudyFlow is helping students elevate their grades and lower stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex text-amber-400 space-x-1">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{t.author}</p>
                <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 border-t border-slate-200 dark:border-slate-800 text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100">StudyFlow</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          StudyFlow is an AI-powered academic success platform built to help college students stay organized, master coursework, and achieve their GPA goals.
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} StudyFlow AI. Designed for College Excellence.
        </p>
      </footer>

    </div>
  );
};
