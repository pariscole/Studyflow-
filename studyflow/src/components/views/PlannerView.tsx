import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  BookOpen,
  X,
  Sparkles,
} from 'lucide-react';
import { Course, DayOfWeek, StudySession } from '../../types';

interface PlannerViewProps {
  sessions: StudySession[];
  courses: Course[];
  onAddSession: (session: StudySession) => void;
  onDeleteSession: (id: string) => void;
  onToggleSessionComplete: (id: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  sessions,
  courses,
  onAddSession,
  onDeleteSession,
  onToggleSessionComplete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'course-1');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Mon');
  const [startTime, setStartTime] = useState('14:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [goal, setGoal] = useState('');

  const days: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCourse = courses.find((c) => c.id === courseId);
    const courseName = selectedCourse ? selectedCourse.name : 'General Study';
    const color = selectedCourse ? selectedCourse.color || 'sky' : 'sky';

    const newSession: StudySession = {
      id: `sess-${Date.now()}`,
      title,
      courseId,
      courseName,
      dayOfWeek,
      startTime,
      durationMinutes: Number(durationMinutes),
      goal,
      completed: false,
      color,
    };

    onAddSession(newSession);
    setIsModalOpen(false);
    setTitle('');
    setGoal('');
  };

  const totalWeeklyMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const completedWeeklyMinutes = sessions.filter((s) => s.completed).reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Weekly Study Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Time-block your study sessions, set goals, and build consistent habits.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-sm shadow-md shadow-sky-500/20 hover:shadow-sky-500/30 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* Weekly Stats Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase">Scheduled Time</span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {(totalWeeklyMinutes / 60).toFixed(1)} hrs
          </p>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase">Completed Study</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {(completedWeeklyMinutes / 60).toFixed(1)} hrs
          </p>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase">Weekly Target</span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            15.0 hrs
          </p>
        </div>
      </div>

      {/* Interactive Weekly Planner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day) => {
          const daySessions = sessions.filter((s) => s.dayOfWeek === day);

          return (
            <div
              key={day}
              className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 space-y-3 flex flex-col min-h-[320px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60">
                <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{day}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  {daySessions.length}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {daySessions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-3 text-slate-300 dark:text-slate-600 text-xs italic">
                    Rest or add session
                  </div>
                ) : (
                  daySessions.map((sess) => (
                    <div
                      key={sess.id}
                      className={`p-3 rounded-xl border text-xs space-y-2 transition-all relative group ${
                        sess.completed
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                          : 'bg-sky-50/60 dark:bg-sky-950/30 border-sky-100 dark:border-sky-900/50 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <button
                          onClick={() => onToggleSessionComplete(sess.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                            sess.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-600 hover:border-sky-500'
                          }`}
                        >
                          {sess.completed && <CheckCircle2 className="w-3 h-3" />}
                        </button>

                        <button
                          onClick={() => onDeleteSession(sess.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div>
                        <p
                          className={`font-bold text-slate-900 dark:text-slate-100 leading-tight ${
                            sess.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {sess.title}
                        </p>
                        <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 block mt-0.5">
                          {sess.courseName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                        <span>⏰ {sess.startTime}</span>
                        <span>{sess.durationMinutes} min</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  setDayOfWeek(day);
                  setIsModalOpen(true);
                }}
                className="w-full py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-sky-50 dark:hover:bg-sky-950/50 text-slate-500 hover:text-sky-600 dark:text-slate-400 text-xs font-bold transition-colors flex items-center justify-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>

            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                Schedule Study Session
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Session Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CS 301 Midterm Active Recall"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Subject / Course
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Day of Week
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Duration (mins)
                  </label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins (1 hr)</option>
                    <option value={90}>90 mins (1.5 hrs)</option>
                    <option value={120}>120 mins (2 hrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Study Goal / Focus Target
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Master Red-Black tree rotations"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md shadow-sky-500/20 transition-all"
                >
                  Schedule Session
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
