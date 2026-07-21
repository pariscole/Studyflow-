import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  GraduationCap,
  Clock,
  Target,
  Sparkles,
  Calendar as CalendarIcon,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Flame,
  RefreshCw,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { Assignment, Course, Exam, StudentProfile, StudySession, ViewMode } from '../../types';
import { MOTIVATIONAL_QUOTES } from '../../data/initialData';
import { QuickTipsModal } from '../QuickTipsModal';

interface DashboardViewProps {
  profile: StudentProfile;
  assignments: Assignment[];
  exams: Exam[];
  courses: Course[];
  sessions: StudySession[];
  toggleAssignmentComplete?: (id: string) => void;
  onToggleAssignment?: (id: string) => void;
  setCurrentView?: (view: ViewMode) => void;
  onNavigate?: (view: ViewMode) => void;
  onOpenQuickAdd?: () => void;
  streak?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  assignments,
  exams,
  courses,
  sessions,
  toggleAssignmentComplete: toggleAssignmentProp,
  onToggleAssignment,
  setCurrentView: setCurrentViewProp,
  onNavigate,
  onOpenQuickAdd = () => {},
  streak = 5,
}) => {
  const toggleAssignmentComplete = (id: string) => {
    if (toggleAssignmentProp) toggleAssignmentProp(id);
    if (onToggleAssignment) onToggleAssignment(id);
  };

  const setCurrentView = (view: ViewMode) => {
    if (setCurrentViewProp) setCurrentViewProp(view);
    if (onNavigate) onNavigate(view);
  };
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isQuickTipsOpen, setIsQuickTipsOpen] = useState(false);

  useEffect(() => {
    // Auto-open Quick Tips if not seen before
    const hasSeen = localStorage.getItem('studyflow_seen_quicktips');
    if (!hasSeen) {
      setIsQuickTipsOpen(true);
    }
  }, []);

  const handleDisableAutoShow = () => {
    localStorage.setItem('studyflow_seen_quicktips', 'true');
  };

  const activeAssignments = assignments.filter((a) => !a.completed);
  const completedAssignments = assignments.filter((a) => a.completed);
  const completionPercentage = assignments.length > 0
    ? Math.round((completedAssignments.length / assignments.length) * 100)
    : 0;

  // Upcoming assignments sorted by due date
  const sortedUpcomingAssignments = [...activeAssignments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Today's tasks (assignments due today or sessions scheduled today)
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAssignments = assignments.filter((a) => a.dueDate === todayStr || !a.completed).slice(0, 4);

  // Upcoming exams sorted
  const sortedUpcomingExams = [...exams].sort(
    (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );

  // Weekly study hours calculation
  const totalWeeklyStudyMinutes = sessions.reduce((acc, s) => acc + (s.completed ? s.durationMinutes : 0), 0);
  const totalWeeklyHours = (totalWeeklyStudyMinutes / 60).toFixed(1);
  const targetWeeklyHours = 15;

  const handleRefreshQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-xl shadow-sky-500/10">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{streak}-Day Productivity Streak</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-sky-100 text-sm font-medium max-w-xl">
              {profile.major} • {profile.semester}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsQuickTipsOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-400/90 hover:bg-amber-400 text-slate-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-1.5 shadow-sm"
              title="View StudyFlow academic tips & navigation hints"
            >
              <Lightbulb className="w-4 h-4 text-slate-900" />
              <span>Quick Tips</span>
            </button>
            <button
              onClick={onOpenQuickAdd}
              className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-sky-50 transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <Plus className="w-4 h-4 text-sky-600" />
              <span>Add Task</span>
            </button>
            <button
              onClick={() => setCurrentView('ai-assistant')}
              className="px-4 py-2.5 rounded-2xl bg-purple-500/40 hover:bg-purple-500/60 backdrop-blur-md text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Daily Motivation Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-slate-800 dark:via-purple-950/40 dark:to-slate-800 border border-purple-100 dark:border-purple-900/50 shadow-sm flex items-start justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                AI Daily Motivation
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1 italic leading-relaxed">
              "{currentQuote.quote}"
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">
              — {currentQuote.author}
            </span>
          </div>
        </div>

        <button
          onClick={handleRefreshQuote}
          className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
          title="New quote"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Weekly Study Hours Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Study</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {totalWeeklyHours} <span className="text-xs font-normal text-slate-500">/ {targetWeeklyHours} hrs</span>
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (parseFloat(totalWeeklyHours) / targetWeeklyHours) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* GPA Goal Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">GPA Goal</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {profile.currentGpa} <span className="text-xs font-normal text-slate-500">/ Goal {profile.gpaGoal}</span>
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(profile.currentGpa / 4.0) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Completion Progress Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completion Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {completionPercentage}%
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Active Courses Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled Courses</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {courses.length} <span className="text-xs font-normal text-slate-500">Subjects</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium truncate">
              Next: {courses[0]?.nextClass || 'No classes today'}
            </p>
          </div>
        </div>

      </div>

      {/* Main Content Grid: Today's Tasks & Upcoming Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Today's Tasks & Upcoming Assignments */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Today's Tasks */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-sky-500" />
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Today's Tasks</h2>
              </div>
              <button
                onClick={() => setCurrentView('assignments')}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {todaysAssignments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  🎉 All tasks for today are complete! Relax or schedule a study session.
                </div>
              ) : (
                todaysAssignments.map((asgn) => (
                  <div
                    key={asgn.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      asgn.completed
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                        : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-800 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                      <button
                        onClick={() => toggleAssignmentComplete(asgn.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                          asgn.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-sky-500'
                        }`}
                      >
                        {asgn.completed && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div className="truncate">
                        <p
                          className={`font-bold text-sm text-slate-900 dark:text-slate-100 truncate ${
                            asgn.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {asgn.title}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{asgn.courseName}</span>
                          <span>•</span>
                          <span className="font-medium text-amber-600 dark:text-amber-400">Due {asgn.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`ml-2 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase shrink-0 ${
                        asgn.priority === 'high'
                          ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300'
                          : asgn.priority === 'medium'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {asgn.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-purple-500" />
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Upcoming Assignments</h2>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                {activeAssignments.length} Pending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedUpcomingAssignments.slice(0, 4).map((asgn) => (
                <div
                  key={asgn.id}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold text-purple-600 dark:text-purple-300 uppercase">
                      {asgn.courseName}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                        asgn.priority === 'high'
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      {asgn.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2">
                    {asgn.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/40 dark:border-slate-700/40">
                    <span className="font-medium text-slate-700 dark:text-slate-300">📅 {asgn.dueDate}</span>
                    <button
                      onClick={() => toggleAssignmentComplete(asgn.id)}
                      className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      Mark Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Upcoming Exams & Weekly Calendar Preview */}
        <div className="space-y-8">
          
          {/* Upcoming Exams Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-rose-500" />
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Upcoming Exams</h2>
              </div>
              <button
                onClick={() => setCurrentView('exams')}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Exam Center
              </button>
            </div>

            <div className="space-y-3">
              {sortedUpcomingExams.slice(0, 3).map((exam) => {
                const daysLeft = Math.ceil(
                  (new Date(exam.examDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                );
                return (
                  <div
                    key={exam.id}
                    className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-300">
                        {exam.courseName}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200">
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Today!'}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{exam.title}</h4>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span>Readiness: {exam.readinessPercentage}%</span>
                      <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: `${exam.readinessPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Calendar Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-amber-500" />
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Study Planner</h2>
              </div>
              <button
                onClick={() => setCurrentView('planner')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Full Schedule
              </button>
            </div>

            <div className="space-y-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => {
                const daySessions = sessions.filter((s) => s.dayOfWeek === day);
                return (
                  <div
                    key={day}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-slate-700 dark:text-slate-300 w-10">{day}</span>
                    <div className="flex-1 px-3 truncate">
                      {daySessions.length > 0 ? (
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          {daySessions.map((s) => s.title).join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No sessions set</span>
                      )}
                    </div>
                    <span className="text-slate-400 font-semibold">{daySessions.length} sessions</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Quick Academic Tips Modal */}
      <QuickTipsModal
        isOpen={isQuickTipsOpen}
        onClose={() => setIsQuickTipsOpen(false)}
        onDisableAutoShow={handleDisableAutoShow}
      />

    </div>
  );
};
