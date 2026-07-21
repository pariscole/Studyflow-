import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Calendar,
  GraduationCap,
  LineChart,
  Sparkles,
  User,
  Home,
  Cpu,
} from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView?: ViewMode;
  activeTab?: ViewMode;
  setCurrentView?: (view: ViewMode) => void;
  setActiveTab?: (view: ViewMode) => void;
  pendingAssignmentCount?: number;
  upcomingExamCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView: currentViewProp,
  activeTab,
  setCurrentView: setCurrentViewProp,
  setActiveTab,
  pendingAssignmentCount = 0,
  upcomingExamCount = 0,
}) => {
  const currentView = currentViewProp || activeTab || 'dashboard';

  const handleNavigate = (view: ViewMode) => {
    if (setCurrentViewProp) setCurrentViewProp(view);
    if (setActiveTab) setActiveTab(view);
  };
  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'courses' as ViewMode, label: 'Courses', icon: BookOpen, badge: null },
    {
      id: 'assignments' as ViewMode,
      label: 'Assignments',
      icon: CheckSquare,
      badge: pendingAssignmentCount > 0 ? pendingAssignmentCount : null,
      badgeColor: 'bg-sky-500 text-white',
    },
    { id: 'planner' as ViewMode, label: 'Study Planner', icon: Calendar, badge: null },
    {
      id: 'exams' as ViewMode,
      label: 'Exam Center',
      icon: GraduationCap,
      badge: upcomingExamCount > 0 ? upcomingExamCount : null,
      badgeColor: 'bg-purple-500 text-white',
    },
    { id: 'progress' as ViewMode, label: 'Progress & Stats', icon: LineChart, badge: null },
    {
      id: 'ai-assistant' as ViewMode,
      label: 'AI Study Assistant',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-gradient-to-r from-sky-500 to-purple-500 text-white font-bold',
    },
    {
      id: 'system' as ViewMode,
      label: 'System Architecture',
      icon: Cpu,
      badge: 'SYS',
      badgeColor: 'bg-emerald-600 text-white font-bold',
    },
    { id: 'profile' as ViewMode, label: 'Student Profile', icon: User, badge: null },
    { id: 'landing' as ViewMode, label: 'Landing Page', icon: Home, badge: null },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-4 shrink-0 min-h-[calc(100vh-4rem)] transition-colors duration-200">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">
            Academic Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 text-sky-600 dark:text-sky-400 font-bold border border-sky-200/50 dark:border-sky-800/50 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-semibold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Motivational Sidebar Banner */}
        <div className="mt-auto pt-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 via-purple-500/10 to-mint-500/10 border border-sky-100 dark:border-slate-800 text-center relative overflow-hidden">
            <div className="w-8 h-8 mx-auto rounded-full bg-sky-500 text-white flex items-center justify-center mb-2 shadow-md shadow-sky-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">AI Tutor Ready</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Ask questions or generate quizzes instantly!
            </p>
            <button
              onClick={() => handleNavigate('ai-assistant')}
              className="mt-3 w-full py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Start AI Chat
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 px-2 py-1 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-sky-600 dark:text-sky-400 font-bold scale-105' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label.split(' ')[0]}</span>
              {item.badge !== null && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
        <button
          onClick={() => handleNavigate('ai-assistant')}
          className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all ${
            currentView === 'ai-assistant' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-purple-500'
          }`}
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] mt-0.5">AI</span>
        </button>
      </nav>
    </>
  );
};
