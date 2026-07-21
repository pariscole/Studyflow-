import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  User,
  Clock,
  Award,
  CheckSquare,
  Building,
  Calendar,
  X,
  Check,
  Calculator,
  Sparkles,
  TrendingUp,
  Target,
} from 'lucide-react';
import { Assignment, Course } from '../../types';
import { calculateCumulativeGpa } from '../../lib/storage';

interface CoursesViewProps {
  courses: Course[];
  assignments?: Assignment[];
  onAddCourse: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  assignments = [],
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Hypothetical GPA Calculator state for student goal-setting
  const [targetGpa, setTargetGpa] = useState(3.9);
  const [simulatedGrades, setSimulatedGrades] = useState<{ [id: string]: number }>({});

  const currentGpa = calculateCumulativeGpa(courses);
  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 3), 0);

  // Calculate simulated GPA based on user slider adjustments
  const simulatedCourses = courses.map((c) => ({
    ...c,
    currentGrade: simulatedGrades[c.id] !== undefined ? simulatedGrades[c.id] : c.currentGrade,
  }));
  const predictedGpa = calculateCumulativeGpa(simulatedCourses);

  const handleSimulatedGradeChange = (courseId: string, val: number) => {
    setSimulatedGrades((prev) => ({
      ...prev,
      [courseId]: val,
    }));
  };

  const handleResetSimulation = () => {
    setSimulatedGrades({});
  };

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [instructor, setInstructor] = useState('');
  const [credits, setCredits] = useState(3);
  const [currentGrade, setCurrentGrade] = useState(90);
  const [nextClass, setNextClass] = useState('Mon, Wed 10:00 AM');
  const [color, setColor] = useState('sky');
  const [schedule, setSchedule] = useState('Mon, Wed 10:00 AM - 11:30 AM');
  const [room, setRoom] = useState('Main Campus 101');

  const openAddModal = () => {
    setEditingCourse(null);
    setName('');
    setCode('');
    setInstructor('');
    setCredits(3);
    setCurrentGrade(90);
    setNextClass('Mon, Wed 10:00 AM');
    setColor('sky');
    setSchedule('Mon, Wed 10:00 AM - 11:30 AM');
    setRoom('Main Campus 101');
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setName(course.name);
    setCode(course.code);
    setInstructor(course.instructor);
    setCredits(course.credits);
    setCurrentGrade(course.currentGrade);
    setNextClass(course.nextClass);
    setColor(course.color || 'sky');
    setSchedule(course.schedule);
    setRoom(course.room);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const letterGrade =
      currentGrade >= 93
        ? 'A'
        : currentGrade >= 90
        ? 'A-'
        : currentGrade >= 87
        ? 'B+'
        : currentGrade >= 83
        ? 'B'
        : 'C';

    const courseData: Course = {
      id: editingCourse ? editingCourse.id : `course-${Date.now()}`,
      name,
      code: code || name.slice(0, 3).toUpperCase() + ' 101',
      instructor,
      credits: Number(credits),
      currentGrade: Number(currentGrade),
      letterGrade,
      remainingAssignments: editingCourse ? editingCourse.remainingAssignments : 2,
      nextClass,
      color,
      schedule,
      room,
    };

    if (editingCourse) {
      onEditCourse(courseData);
    } else {
      onAddCourse(courseData);
    }

    setIsModalOpen(false);
  };

  const getColorClasses = (c: string) => {
    switch (c) {
      case 'sky':
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/30',
          border: 'border-sky-200 dark:border-sky-800',
          badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300',
          accent: 'from-sky-500 to-indigo-500',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/30',
          border: 'border-purple-200 dark:border-purple-800',
          badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
          accent: 'from-purple-500 to-pink-500',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          border: 'border-emerald-200 dark:border-emerald-800',
          badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
          accent: 'from-emerald-500 to-teal-500',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/30',
          border: 'border-amber-200 dark:border-amber-800',
          badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
          accent: 'from-amber-500 to-orange-500',
        };
      default:
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-950/30',
          border: 'border-indigo-200 dark:border-indigo-800',
          badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
          accent: 'from-indigo-500 to-purple-500',
        };
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Enrolled Courses
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your academic subjects, instructors, grades, and schedules.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-sm shadow-md shadow-sky-500/20 hover:shadow-sky-500/30 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const style = getColorClasses(course.color);
          return (
            <div
              key={course.id}
              className={`rounded-3xl border ${style.border} ${style.bg} p-6 shadow-sm hover:shadow-md transition-all space-y-5 relative overflow-hidden group`}
            >
              {/* Top Accent Strip */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${style.accent}`} />

              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${style.badge}`}>
                    {course.code}
                  </span>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100 mt-2">
                    {course.name}
                  </h3>
                </div>

                <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(course)}
                    className="p-2 text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 transition-colors"
                    title="Edit course"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    className="p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 transition-colors"
                    title="Delete course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Course Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{course.instructor || 'Prof. Unassigned'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                  <Award className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{course.credits} Credits</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{course.schedule}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{course.room}</span>
                </div>
              </div>

              {/* Grade & Status Footer */}
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Current Grade</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                      {course.currentGrade}%
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      ({course.letterGrade || 'A'})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Remaining Tasks</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {assignments
                      ? assignments.filter((a) => a.courseId === course.id && !a.completed).length
                      : course.remainingAssignments}{' '}
                    Pending
                  </p>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* GPA Tracker & Grade Goal Predictor */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-sky-500 flex items-center justify-center text-white shadow-md">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                GPA Tracker & Grade Goal Predictor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simulate potential course grades to project your final term GPA live.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Actual GPA</span>
              <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                {currentGpa.toFixed(2)}
              </span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center">
              <span className="text-[10px] font-bold text-purple-500 uppercase block">Projected GPA</span>
              <span className="text-lg font-black text-purple-600 dark:text-purple-300">
                {predictedGpa.toFixed(2)}
              </span>
            </div>

            {Object.keys(simulatedGrades).length > 0 && (
              <button
                onClick={handleResetSimulation}
                className="text-xs font-bold text-rose-500 hover:underline px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Grade Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => {
            const currentVal =
              simulatedGrades[c.id] !== undefined ? simulatedGrades[c.id] : c.currentGrade;
            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-slate-100">
                    {c.code} ({c.credits} cr)
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 font-extrabold">
                    {currentVal}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={currentVal}
                  onChange={(e) => handleSimulatedGradeChange(c.id, Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                {editingCourse ? 'Edit Course Details' : 'Add New Course'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Organic Chemistry II"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. CHEM 210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Instructor Name
                  </label>
                  <input
                    type="text"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="e.g. Dr. Jane Smith"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Credits
                  </label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Grade (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentGrade}
                    onChange={(e) => setCurrentGrade(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Color Theme
                  </label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="sky">Sky Blue</option>
                    <option value="purple">Purple</option>
                    <option value="emerald">Mint Green</option>
                    <option value="amber">Yellow / Amber</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Schedule & Room
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="Mon, Wed 10:00 AM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Building / Room 202"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
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
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
