import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  BookOpen,
  GraduationCap,
  Calendar,
  Plus,
} from 'lucide-react';
import { Assignment, Course, Exam, StudySession, Priority, ExamDifficulty, DayOfWeek } from '../../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onAddAssignment: (asgn: Assignment) => void;
  onAddCourse: (course: Course) => void;
  onAddExam: (exam: Exam) => void;
  onAddSession: (session: StudySession) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  courses,
  onAddAssignment,
  onAddCourse,
  onAddExam,
  onAddSession,
}) => {
  const [tab, setTab] = useState<'assignment' | 'course' | 'exam' | 'session'>('assignment');

  // Common Form States
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'course-1');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<Priority>('medium');
  const [instructor, setInstructor] = useState('');
  const [credits, setCredits] = useState(3);
  const [examDate, setExamDate] = useState('2026-07-28T10:00');
  const [location, setLocation] = useState('Turing Hall 204');
  const [difficulty, setDifficulty] = useState<ExamDifficulty>('Challenging');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Mon');
  const [durationMinutes, setDurationMinutes] = useState(60);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCourse = courses.find((c) => c.id === courseId);
    const courseName = selectedCourse ? selectedCourse.name : 'General Subject';

    if (tab === 'assignment') {
      onAddAssignment({
        id: `asgn-${Date.now()}`,
        title,
        courseId,
        courseName,
        dueDate,
        priority,
        completed: false,
        estimatedMinutes: 60,
      });
    } else if (tab === 'course') {
      onAddCourse({
        id: `course-${Date.now()}`,
        name: title,
        code: title.slice(0, 4).toUpperCase() + ' 101',
        instructor: instructor || 'Prof. Unassigned',
        credits: Number(credits),
        currentGrade: 90,
        letterGrade: 'A-',
        remainingAssignments: 1,
        nextClass: 'Mon 10:00 AM',
        color: 'sky',
        schedule: 'Mon, Wed 10:00 AM',
        room: 'Main Quad 101',
      });
    } else if (tab === 'exam') {
      onAddExam({
        id: `exam-${Date.now()}`,
        title,
        courseId,
        courseName,
        examDate,
        location: location || 'Campus Center',
        difficulty,
        readinessPercentage: 50,
        studyGoalHours: 10,
        checklist: [
          { id: 'chk-1', task: 'Review core lecture notes', completed: false },
          { id: 'chk-2', task: 'Complete practice questions', completed: false },
        ],
      });
    } else if (tab === 'session') {
      onAddSession({
        id: `sess-${Date.now()}`,
        title,
        courseId,
        courseName,
        dayOfWeek,
        startTime: '14:00',
        durationMinutes: Number(durationMinutes),
        goal: 'Focus & Active Recall',
        completed: false,
        color: selectedCourse?.color || 'sky',
      });
    }

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-sky-500" />
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">Quick Add</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => setTab('assignment')}
            className={`py-2 rounded-xl transition-all flex flex-col items-center space-y-1 ${
              tab === 'assignment' ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Assignment</span>
          </button>

          <button
            onClick={() => setTab('course')}
            className={`py-2 rounded-xl transition-all flex flex-col items-center space-y-1 ${
              tab === 'course' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Course</span>
          </button>

          <button
            onClick={() => setTab('exam')}
            className={`py-2 rounded-xl transition-all flex flex-col items-center space-y-1 ${
              tab === 'exam' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Exam</span>
          </button>

          <button
            onClick={() => setTab('session')}
            className={`py-2 rounded-xl transition-all flex flex-col items-center space-y-1 ${
              tab === 'session' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Session</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {tab === 'assignment' && 'Assignment Title *'}
              {tab === 'course' && 'Course Name *'}
              {tab === 'exam' && 'Exam Title *'}
              {tab === 'session' && 'Session Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 5 Problem Set"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {tab !== 'course' && (
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Associated Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {tab === 'assignment' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'course' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Instructor</label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Credits</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          {tab === 'exam' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Exam Date & Time</label>
                <input
                  type="datetime-local"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as ExamDifficulty)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                  <option value="Hardcore">Hardcore</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'session' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Day of Week</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Mon">Monday</option>
                  <option value="Tue">Tuesday</option>
                  <option value="Wed">Wednesday</option>
                  <option value="Thu">Thursday</option>
                  <option value="Fri">Friday</option>
                  <option value="Sat">Saturday</option>
                  <option value="Sun">Sunday</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration (mins)</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value={30}>30 mins</option>
                  <option value={60}>60 mins (1 hr)</option>
                  <option value={90}>90 mins (1.5 hrs)</option>
                  <option value={120}>120 mins (2 hrs)</option>
                </select>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md shadow-sky-500/20"
            >
              Add Item
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
