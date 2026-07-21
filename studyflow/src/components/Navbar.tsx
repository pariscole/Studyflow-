import React, { useState } from 'react';
import {
  BookOpen,
  Bell,
  Search,
  Plus,
  Flame,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  X,
  ChevronRight,
} from 'lucide-react';
import { NotificationItem, StudentProfile, ViewMode, NavTab } from '../types';

interface NavbarProps {
  currentView?: ViewMode;
  setCurrentView?: (view: ViewMode) => void;
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
  profile: StudentProfile;
  streak?: number;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
  notifications?: NotificationItem[];
  markNotificationAsRead?: (id: string) => void;
  markAllNotificationsAsRead?: () => void;
  onOpenQuickAdd?: () => void;
  onQuickAdd?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  activeTab,
  setActiveTab,
  profile,
  streak = 5,
  darkMode,
  setDarkMode,
  isDarkMode,
  toggleDarkMode,
  notifications = [],
  markNotificationAsRead = (_id: string) => {},
  markAllNotificationsAsRead = () => {},
  onOpenQuickAdd,
  onQuickAdd,
  searchQuery,
  setSearchQuery,
}) => {
  const [showNotifPopover, setShowNotifPopover] = useState(false);

  const activeView: ViewMode = activeTab || currentView || 'dashboard';
  const handleNavigate = (view: ViewMode) => {
    if (setActiveTab) setActiveTab(view);
    else if (setCurrentView) setCurrentView(view);
  };

  const isDarkTheme = isDarkMode !== undefined ? isDarkMode : (darkMode ?? false);
  const handleToggleDark = () => {
    if (toggleDarkMode) toggleDarkMode();
    else if (setDarkMode) setDarkMode(!isDarkTheme);
  };

  const handleTriggerQuickAdd = () => {
    if (onQuickAdd) onQuickAdd();
    else if (onOpenQuickAdd) onOpenQuickAdd();
  };

  const safeNotifications = notifications || [];
  const unreadCount = safeNotifications.filter((n) => !n?.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigate('landing')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-sky-500/20 text-white font-black text-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-sky-400 dark:via-purple-400 dark:to-purple-300 bg-clip-text text-transparent">
                  StudyFlow
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Academic Success Platform
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, assignments, exams..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm rounded-full border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Add Button */}
            <button
              onClick={handleTriggerQuickAdd}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium text-xs sm:text-sm shadow-md shadow-sky-500/20 hover:shadow-sky-500/30 hover:opacity-95 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Add</span>
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={() => handleNavigate('ai-assistant')}
              className={`p-2 rounded-full transition-all ${
                activeView === 'ai-assistant'
                  ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 ring-2 ring-purple-400'
                  : 'bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-slate-700'
              }`}
              title="AI Study Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Streak flame badge */}
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>{streak}d</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={handleToggleDark}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notification Popover Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifPopover(!showNotifPopover)}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifPopover && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-sky-500" />
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="mt-3 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 pr-1">
                    {safeNotifications.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
                        No notifications right now!
                      </div>
                    ) : (
                      safeNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.targetView) {
                              handleNavigate(n.targetView as ViewMode);
                              setShowNotifPopover(false);
                            }
                          }}
                          className={`py-2.5 px-2 rounded-xl transition-colors cursor-pointer flex items-start space-x-3 ${
                            n.read
                              ? 'opacity-70 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                              : 'bg-sky-50/50 dark:bg-sky-950/30 hover:bg-sky-50 dark:hover:bg-sky-950/60'
                          }`}
                        >
                          <div className="mt-0.5">
                            {n.type === 'assignment' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                            {n.type === 'exam' && <Clock className="w-4 h-4 text-rose-500" />}
                            {n.type === 'session' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            {n.type === 'deadline' && <AlertCircle className="w-4 h-4 text-purple-500" />}
                          </div>
                          <div className="flex-1 text-xs">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</p>
                            <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block font-medium">{n.date}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      onClick={() => setShowNotifPopover(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Trigger */}
            <button
              onClick={() => handleNavigate('profile')}
              className={`flex items-center space-x-2 pl-1.5 pr-2 py-1 rounded-full transition-all border ${
                activeView === 'profile'
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={profile.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-sky-400/50"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:inline max-w-[100px] truncate">
                {profile.name ? profile.name.split(' ')[0] : 'Student'}
              </span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
