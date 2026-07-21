import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  MapPin,
  X,
  Target,
} from 'lucide-react';
import { Course, Exam, ExamDifficulty, ExamChecklistItem } from '../../types';

interface ExamCenterViewProps {
  exams: Exam[];
  courses: Course[];
  onAddExam: (exam: Exam) => void;
  onEditExam: (exam: Exam) => void;
  onDeleteExam: (id: string) => void;
  onToggleChecklistTask: (examId: string, taskId: string) => void;
  onAddChecklistTask: (examId: string, taskTitle: string) => void;
}

export const ExamCenterView: React.FC<ExamCenterViewProps> = ({
  exams,
  courses,
  onAddExam,
  onEditExam,
  onDeleteExam,
  onToggleChecklistTask,
  onAddChecklistTask,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // Countdown Live Timer State
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Form state
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'course-1');
  const [examDate, setExamDate] = useState('2026-07-28T10:00');
  const [location, setLocation] = useState('Turing Hall 204');
  const [difficulty, setDifficulty] = useState<ExamDifficulty>('Challenging');
  const [studyGoalHours, setStudyGoalHours] = useState(10);
  const [newTaskInput, setNewTaskInput] = useState<{ [examId: string]: string }>({});

  const openAddModal = () => {
    setEditingExam(null);
    setTitle('');
    setCourseId(courses[0]?.id || 'course-1');
    setExamDate('2026-07-28T10:00');
    setLocation('Turing Hall 204');
    setDifficulty('Challenging');
    setStudyGoalHours(10);
    setIsModalOpen(true);
  };

  const openEditModal = (exam: Exam) => {
    setEditingExam(exam);
    setTitle(exam.title);
    setCourseId(exam.courseId);
    setExamDate(exam.examDate);
    setLocation(exam.location);
    setDifficulty(exam.difficulty);
    setStudyGoalHours(exam.studyGoalHours);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCourse = courses.find((c) => c.id === courseId);
    const courseName = selectedCourse ? `${selectedCourse.code} - ${selectedCourse.name}` : 'General Course';

    const examData: Exam = {
      id: editingExam ? editingExam.id : `exam-${Date.now()}`,
      title,
      courseId,
      courseName,
      examDate,
      location,
      difficulty,
      readinessPercentage: editingExam ? editingExam.readinessPercentage : 50,
      studyGoalHours: Number(studyGoalHours),
      checklist: editingExam
        ? editingExam.checklist
        : [
            { id: `chk-1`, task: 'Review core lecture slides and chapter notes', completed: false },
            { id: `chk-2`, task: 'Solve practice problems and past exam sets', completed: false },
            { id: `chk-3`, task: 'AI Study Assistant review quiz', completed: false },
          ],
    };

    if (editingExam) {
      onEditExam(examData);
    } else {
      onAddExam(examData);
    }

    setIsModalOpen(false);
  };

  const calculateTimeLeft = (targetDateStr: string) => {
    const diff = new Date(targetDateStr).getTime() - currentTime.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isPast: false };
  };

  const handleAddNewTask = (examId: string) => {
    const text = newTaskInput[examId];
    if (text && text.trim()) {
      onAddChecklistTask(examId, text.trim());
      setNewTaskInput({ ...newTaskInput, [examId]: '' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Exam Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track exam countdowns, build study checklists, and monitor readiness.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-sm shadow-md shadow-rose-500/20 hover:shadow-rose-500/30 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Upcoming Exam</span>
        </button>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {exams.map((exam) => {
          const timeLeft = calculateTimeLeft(exam.examDate);

          const completedTasks = exam.checklist.filter((t) => t.completed).length;
          const totalTasks = exam.checklist.length;
          const calculatedReadiness = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <div
              key={exam.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all space-y-6 relative overflow-hidden"
            >
              {/* Top Bar info */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    {exam.courseName}
                  </span>
                  <h3 className="font-extrabold text-2xl text-slate-900 dark:text-slate-100 mt-1">
                    {exam.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-1">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full ${
                      exam.difficulty === 'Hardcore'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : exam.difficulty === 'Challenging'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {exam.difficulty}
                  </span>
                  <button
                    onClick={() => openEditModal(exam)}
                    className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteExam(exam.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live Countdown Timer Block */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-sky-500/10 border border-rose-100/80 dark:border-rose-900/40 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  ⏰ Live Exam Countdown
                </span>

                {timeLeft.isPast ? (
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    🎉 Exam Concluded!
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
                      <span className="text-xl font-black text-rose-600 dark:text-rose-400 block">{timeLeft.days}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Days</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
                      <span className="text-xl font-black text-purple-600 dark:text-purple-400 block">{timeLeft.hours}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Hours</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
                      <span className="text-xl font-black text-sky-600 dark:text-sky-400 block">{timeLeft.minutes}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Mins</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
                      <span className="text-xl font-black text-amber-500 block">{timeLeft.seconds}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Secs</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Exam Readiness & Location bar */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Readiness Level</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                      {calculatedReadiness}%
                    </span>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-500 to-rose-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${calculatedReadiness}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Location</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {exam.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Study Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Study Checklist ({completedTasks}/{totalTasks})</span>
                  </h4>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {exam.checklist.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onToggleChecklistTask(exam.id, task.id)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center space-x-3 cursor-pointer transition-all ${
                        task.completed
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40 text-slate-400 line-through'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-white'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className="flex-1 font-medium">{task.task}</span>
                    </div>
                  ))}
                </div>

                {/* Add new task inline */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    value={newTaskInput[exam.id] || ''}
                    onChange={(e) => setNewTaskInput({ ...newTaskInput, [exam.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNewTask(exam.id)}
                    placeholder="Add checklist item..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddNewTask(exam.id)}
                    className="px-3 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                {editingExam ? 'Edit Exam' : 'Add Upcoming Exam'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm 2 - Data Structures"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Course
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as ExamDifficulty)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Hardcore">Hardcore</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Exam Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Location / Room
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Turing Hall 204"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-500/20 transition-all"
                >
                  {editingExam ? 'Save Changes' : 'Create Exam'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
