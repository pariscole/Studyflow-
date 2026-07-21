import React, { useState } from 'react';
import {
  Lightbulb,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  GraduationCap,
  Sparkles,
  Database,
} from 'lucide-react';

interface QuickTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisableAutoShow?: () => void;
}

export const QuickTipsModal: React.FC<QuickTipsModalProps> = ({
  isOpen,
  onClose,
  onDisableAutoShow,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const tips = [
    {
      title: 'Smart Dashboard & Streak',
      icon: LayoutDashboard,
      color: 'bg-sky-500 text-white',
      badge: 'Overview',
      description:
        'Your command center for academic success! Check your daily productivity streak, view upcoming high-priority assignments, and get AI-powered daily motivation.',
      advice: 'Pro-Tip: Keep your streak alive by logging at least one completed study block or assignment daily.',
    },
    {
      title: 'Assignment Tracker & Priorities',
      icon: CheckSquare,
      color: 'bg-indigo-500 text-white',
      badge: 'Task Management',
      description:
        'Filter tasks by course or completion status, set priorities (High, Medium, Low), and add course-specific due dates and notes.',
      advice: 'Pro-Tip: Tackle High priority assignments first during your peak energy hours.',
    },
    {
      title: 'Weekly Study Planner',
      icon: Calendar,
      color: 'bg-purple-500 text-white',
      badge: 'Time Blocking',
      description:
        'Time-block your study sessions for each day of the week. Set target study hours and track completed study time against your weekly goal.',
      advice: 'Pro-Tip: Break big study blocks into 45-60 minute focus sessions with short breaks.',
    },
    {
      title: 'Exam Readiness Countdown',
      icon: GraduationCap,
      color: 'bg-rose-500 text-white',
      badge: 'Exam Center',
      description:
        'Never get caught unprepared for midterms or finals! Log exam dates, track your readiness percentage, and build interactive prep checklists.',
      advice: 'Pro-Tip: Update your readiness meter as you finish checklist study topics.',
    },
    {
      title: 'AI Study Coach',
      icon: Sparkles,
      color: 'bg-amber-500 text-white',
      badge: 'AI Helper',
      description:
        'Use the AI Study Assistant to clarify difficult concepts, generate custom practice quizzes, or ask for personalized study strategies.',
      advice: 'Pro-Tip: StudyFlow uses AI as an assistant to enhance your organization without replacing your own critical thinking.',
    },
    {
      title: 'Backup & Restore Data',
      icon: Database,
      color: 'bg-emerald-500 text-white',
      badge: 'Data Security',
      description:
        'Your academic data is saved locally on your device. You can export a JSON backup anytime in Student Profile settings or restore a previously saved file.',
      advice: 'Pro-Tip: Download a monthly JSON backup to safeguard your schedule before major term updates.',
    },
  ];

  const currentTip = tips[currentStep];
  const Icon = currentTip.icon;

  const handleClose = () => {
    if (dontShowAgain && onDisableAutoShow) {
      onDisableAutoShow();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 relative overflow-hidden">
        
        {/* Background Subtle Gradient Blob */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/10 dark:bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-slate-100">
                Quick Academic Advice
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hint {currentStep + 1} of {tips.length}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-6 gap-1.5 pt-1">
          {tips.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-sky-500 w-full'
                  : idx < currentStep
                  ? 'bg-sky-200 dark:bg-sky-900 w-full'
                  : 'bg-slate-100 dark:bg-slate-800 w-full'
              }`}
            />
          ))}
        </div>

        {/* Tip Body Card */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-2xl ${currentTip.color} flex items-center justify-center shadow-md`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  {currentTip.badge}
                </span>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {currentTip.title}
                </h4>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {currentTip.description}
          </p>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-xs font-semibold leading-relaxed">
            💡 {currentTip.advice}
          </div>
        </div>

        {/* Don't show again toggle & Navigation Controls */}
        <div className="space-y-4 pt-2">
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span>Don't auto-open tips on future dashboard visits</span>
          </label>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors ${
                currentStep === 0
                  ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep < tips.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(tips.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 flex items-center space-x-1.5 transition-all"
              >
                <span>Next Tip</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Got It! Start Studying</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
