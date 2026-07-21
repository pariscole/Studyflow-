import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Plus,
  Trash2,
  Edit3,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { Assignment, Course, Priority } from '../../types';

interface AssignmentTrackerViewProps {
  assignments: Assignment[];
  courses: Course[];
  onAddAssignment: (assignment: Assignment) => void;
  onEditAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  onToggleComplete: (id: string) => void;
  searchQuery: string;
}

export const AssignmentTrackerView: React.FC<AssignmentTrackerViewProps> = ({
  assignments,
  courses,
  onAddAssignment,
  onEditAssignment,
  onDeleteAssignment,
  onToggleComplete,
  searchQuery,
}) => {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'course-1');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<Priority>('medium');
  const [notes, setNotes] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);

  const openAddModal = () => {
    setEditingAssignment(null);
    setTitle('');
    setCourseId(courses[0]?.id || 'course-1');
    setDueDate(new Date().toISOString().split('T')[0]);
    setPriority('medium');
    setNotes('');
    setEstimatedMinutes(60);
    setIsModalOpen(true);
  };

  const openEditModal = (asgn: Assignment) => {
    setEditingAssignment(asgn);
    setTitle(asgn.title);
    setCourseId(asgn.courseId);
    setDueDate(asgn.dueDate);
    setPriority(asgn.priority);
    setNotes(asgn.notes || '');
    setEstimatedMinutes(asgn.estimatedMinutes || 60);
    setIsModalOpen(true);
  };

  const handleToggleWithConfetti = (id: string, currentCompleted: boolean) => {
    onToggleComplete(id);
    if (!currentCompleted) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // Fallback if canvas-confetti environment context differs
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCourse = courses.find((c) => c.id === courseId);
    const courseName = selectedCourse ? `${selectedCourse.code} - ${selectedCourse.name}` : 'General Subject';

    const assignmentData: Assignment = {
      id: editingAssignment ? editingAssignment.id : `asgn-${Date.now()}`,
      title,
      courseId,
      courseName,
      dueDate,
      priority,
      completed: editingAssignment ? editingAssignment.completed : false,
      notes,
      estimatedMinutes: Number(estimatedMinutes),
      score: editingAssignment ? editingAssignment.score : 'Pending',
    };

    if (editingAssignment) {
      onEditAssignment(assignmentData);
    } else {
      onAddAssignment(assignmentData);
    }

    setIsModalOpen(false);
  };

  // Filter & Sort Logic
  const filteredAssignments = assignments.filter((asgn) => {
    const matchesCourse = selectedCourseFilter === 'all' || asgn.courseId === selectedCourseFilter;
    const matchesStatus =
      selectedStatusFilter === 'all'
        ? true
        : selectedStatusFilter === 'pending'
        ? !asgn.completed
        : asgn.completed;
    const matchesSearch =
      asgn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asgn.courseName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCourse && matchesStatus && matchesSearch;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Assignment Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay ahead of deadlines, set priorities, and keep homework organized.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-sm shadow-md shadow-sky-500/20 hover:shadow-sky-500/30 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Assignment</span>
        </button>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Course Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCourseFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCourseFilter === 'all'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Courses ({assignments.length})
          </button>

          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourseFilter(course.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCourseFilter === course.id
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {course.code}
            </button>
          ))}
        </div>

        {/* Status & Sorting Options */}
        <div className="flex items-center space-x-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
          
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedStatusFilter === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedStatusFilter === 'pending' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedStatusFilter('completed')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedStatusFilter === 'completed' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500'
              }`}
            >
              Completed
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-2.5 py-1.5 rounded-xl border-none focus:outline-none"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

        </div>

      </div>

      {/* Assignment List */}
      <div className="space-y-3">
        {sortedAssignments.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">No Assignments Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no assignments matching your current filter. Create a new task to stay organized!
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors"
            >
              Add First Assignment
            </button>
          </div>
        ) : (
          sortedAssignments.map((asgn) => (
            <div
              key={asgn.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                asgn.completed
                  ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-70'
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/60 hover:border-sky-300 dark:hover:border-sky-800 shadow-sm'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                <button
                  onClick={() => handleToggleWithConfetti(asgn.id, asgn.completed)}
                  className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                    asgn.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                      : 'border-slate-300 dark:border-slate-600 hover:border-sky-500'
                  }`}
                  title={asgn.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {asgn.completed && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase">
                      {asgn.courseName}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                        asgn.priority === 'high'
                          ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300'
                          : asgn.priority === 'medium'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {asgn.priority} priority
                    </span>
                  </div>

                  <h3
                    className={`font-extrabold text-base text-slate-900 dark:text-slate-100 leading-tight ${
                      asgn.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {asgn.title}
                  </h3>

                  {asgn.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {asgn.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Due Date & Controls */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/60">
                <div className="text-left sm:text-right text-xs">
                  <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{asgn.dueDate}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Est. {asgn.estimatedMinutes || 60} mins
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(asgn)}
                    className="p-2 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteAssignment(asgn.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Modal Add/Edit Assignment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                {editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
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
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Problem Set"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Priority
                  </label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Est. Minutes
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Notes / Instructions
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instructions, Canvas submission links, key formulas..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
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
                  {editingAssignment ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
