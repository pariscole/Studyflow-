import React from 'react';
import {
  LineChart as LineChartIcon,
  Flame,
  Award,
  Target,
  CheckCircle2,
  Clock,
  GraduationCap,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from 'recharts';
import { AchievementBadge, Assignment, Course, StudentProfile, StudySession } from '../../types';
import { calculateCumulativeGpa } from '../../lib/storage';

interface ProgressDashboardViewProps {
  profile: StudentProfile;
  assignments: Assignment[];
  courses: Course[];
  sessions: StudySession[];
  achievements: AchievementBadge[];
  streak: number;
}

export const ProgressDashboardView: React.FC<ProgressDashboardViewProps> = ({
  profile,
  assignments,
  courses,
  sessions,
  achievements,
  streak,
}) => {
  // Compute Real Calculated GPA from courses
  const calculatedGpa = calculateCumulativeGpa(courses);
  const currentGpa = calculatedGpa || profile.currentGpa;

  // Compute Weekly Study Hours Data dynamically from actual study sessions
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyStudyData = days.map((day) => {
    const daySessions = sessions.filter((s) => s.dayOfWeek === day);
    const totalMins = daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const completedMins = daySessions.filter((s) => s.completed).reduce((sum, s) => sum + s.durationMinutes, 0);
    return {
      day,
      hours: Number((completedMins / 60).toFixed(1)),
      target: Number((totalMins / 60 || 2.0).toFixed(1)),
    };
  });

  // Course Grade Radar Data
  const courseRadarData = courses.map((c) => ({
    subject: c.code,
    grade: c.currentGrade,
    fullMark: 100,
  }));

  // Semester Performance Trend
  const monthlyTrendData = [
    { month: 'Apr', completion: 78, studyHours: 38, gpa: Number((currentGpa - 0.08).toFixed(2)) },
    { month: 'May', completion: 82, studyHours: 42, gpa: Number((currentGpa - 0.05).toFixed(2)) },
    { month: 'Jun', completion: 88, studyHours: 48, gpa: Number((currentGpa - 0.02).toFixed(2)) },
    { month: 'Jul', completion: 94, studyHours: 54, gpa: currentGpa },
  ];

  const completedCount = assignments.filter((a) => a.completed).length;
  const totalCount = assignments.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const gpaAchievedPercent = Math.min(100, Math.round((currentGpa / profile.gpaGoal) * 100));

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Progress & Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor your study habits, course performance trends, and unlock milestone badges.
        </p>
      </div>

      {/* Top 3 KPI Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Streak & Productivity */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Productivity Streak</span>
            <Flame className="w-6 h-6 text-amber-200 animate-bounce" />
          </div>
          <p className="text-4xl font-black">{streak} Days</p>
          <p className="text-xs text-amber-100 font-medium pt-1">
            Active daily study sessions logged this week!
          </p>
        </div>

        {/* GPA Goal Milestone */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">GPA Goal Tracking</span>
            <Target className="w-6 h-6 text-purple-200" />
          </div>
          <p className="text-4xl font-black">{currentGpa.toFixed(2)}</p>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-amber-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${gpaAchievedPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-purple-200 block pt-1">
            Target: {profile.gpaGoal} GPA ({gpaAchievedPercent}% achieved)
          </span>
        </div>

        {/* Total Assignment Completion */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-100">Task Completion</span>
            <CheckCircle2 className="w-6 h-6 text-sky-200" />
          </div>
          <p className="text-4xl font-black">{completionPercentage}%</p>
          <p className="text-xs text-sky-100 font-medium pt-1">
            {completedCount} of {totalCount} total assignments completed
          </p>
        </div>

      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weekly Study Hours Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Weekly Study Hours</h3>
              <p className="text-xs text-slate-400">Actual vs Target study duration per day</p>
            </div>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300">
              This Week
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStudyData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="hours" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" fill="#e2e8f0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Performance Radar / Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Subject Mastery Radar</h3>
              <p className="text-xs text-slate-400">Current grade breakdown across enrolled courses</p>
            </div>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
              GPA 3.82
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={courseRadarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
                <Radar name="Grade" dataKey="grade" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Performance Trend Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Semester Growth Trend</h3>
            <p className="text-xs text-slate-400">Task completion percentage growth month over month</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="completion" stroke="#10b981" fillOpacity={1} fill="url(#colorComp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Achievement Badges Gallery */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Achievement Badges</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Unlock milestone badges by maintaining study streaks and completing tasks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {achievements.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                badge.unlocked
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700 opacity-50 grayscale'
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center font-bold shadow-xs ${
                  badge.unlocked ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>
              <p className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-tight">{badge.title}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">{badge.description}</p>
              {badge.unlocked && (
                <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 block pt-1">
                  Unlocked ✓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
