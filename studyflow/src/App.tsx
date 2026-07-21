import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/views/LandingView';
import { DashboardView } from './components/views/DashboardView';
import { CoursesView } from './components/views/CoursesView';
import { AssignmentTrackerView } from './components/views/AssignmentTrackerView';
import { PlannerView } from './components/views/PlannerView';
import { ExamCenterView } from './components/views/ExamCenterView';
import { ProgressDashboardView } from './components/views/ProgressDashboardView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { ProfileView } from './components/views/ProfileView';
import { SystemArchitectureView } from './components/views/SystemArchitectureView';
import { QuickAddModal } from './components/modals/QuickAddModal';

import {
  getStoredProfile,
  saveStoredProfile,
  getStoredCourses,
  saveStoredCourses,
  getStoredAssignments,
  saveStoredAssignments,
  getStoredSessions,
  saveStoredSessions,
  getStoredExams,
  saveStoredExams,
  getStoredNotifications,
  saveStoredNotifications,
  getStoredStreak,
  saveStoredStreak,
  getStoredAchievements as getStoredBadges,
  resetAllDemoData as resetAllToInitial,
} from './lib/storage';

import {
  Assignment,
  Course,
  Exam,
  StudentProfile,
  StudySession,
  AchievementBadge,
  NotificationItem,
  NavTab,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('landing');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('studyflow_theme') === 'dark';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);

  // App Centralized State from LocalStorage
  const [profile, setProfile] = useState<StudentProfile>(getStoredProfile());
  const [courses, setCourses] = useState<Course[]>(getStoredCourses());
  const [assignments, setAssignments] = useState<Assignment[]>(getStoredAssignments());
  const [sessions, setSessions] = useState<StudySession[]>(getStoredSessions());
  const [exams, setExams] = useState<Exam[]>(getStoredExams());
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications());
  const [streak, setStreak] = useState<number>(getStoredStreak());
  const [badges, setBadges] = useState<AchievementBadge[]>(getStoredBadges());

  // Notification Handlers
  const handleMarkNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleMarkAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  // Dark Mode Sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('studyflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('studyflow_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Profile Handlers
  const handleUpdateProfile = (updated: StudentProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
  };

  // Course Handlers
  const handleAddCourse = (newCourse: Course) => {
    const updated = [newCourse, ...courses];
    setCourses(updated);
    saveStoredCourses(updated);
  };

  const handleEditCourse = (edited: Course) => {
    const updated = courses.map((c) => (c.id === edited.id ? edited : c));
    setCourses(updated);
    saveStoredCourses(updated);
  };

  const handleDeleteCourse = (id: string) => {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    saveStoredCourses(updated);
  };

  // Assignment Handlers
  const handleAddAssignment = (newAsgn: Assignment) => {
    const updated = [newAsgn, ...assignments];
    setAssignments(updated);
    saveStoredAssignments(updated);
  };

  const handleEditAssignment = (edited: Assignment) => {
    const updated = assignments.map((a) => (a.id === edited.id ? edited : a));
    setAssignments(updated);
    saveStoredAssignments(updated);
  };

  const handleDeleteAssignment = (id: string) => {
    const updated = assignments.filter((a) => a.id !== id);
    setAssignments(updated);
    saveStoredAssignments(updated);
  };

  const handleToggleAssignmentComplete = (id: string) => {
    const updated = assignments.map((a) =>
      a.id === id ? { ...a, completed: !a.completed } : a
    );
    setAssignments(updated);
    saveStoredAssignments(updated);
  };

  // Study Session Handlers
  const handleAddSession = (newSess: StudySession) => {
    const updated = [newSess, ...sessions];
    setSessions(updated);
    saveStoredSessions(updated);
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    saveStoredSessions(updated);
  };

  const handleToggleSessionComplete = (id: string) => {
    const updated = sessions.map((s) =>
      s.id === id ? { ...s, completed: !s.completed } : s
    );
    setSessions(updated);
    saveStoredSessions(updated);
  };

  // Exam Handlers
  const handleAddExam = (newExam: Exam) => {
    const updated = [newExam, ...exams];
    setExams(updated);
    saveStoredExams(updated);
  };

  const handleEditExam = (edited: Exam) => {
    const updated = exams.map((e) => (e.id === edited.id ? edited : e));
    setExams(updated);
    saveStoredExams(updated);
  };

  const handleDeleteExam = (id: string) => {
    const updated = exams.filter((e) => e.id !== id);
    setExams(updated);
    saveStoredExams(updated);
  };

  const handleToggleExamChecklistTask = (examId: string, taskId: string) => {
    const updated = exams.map((exam) => {
      if (exam.id === examId) {
        const updatedChecklist = exam.checklist.map((item) =>
          item.id === taskId ? { ...item, completed: !item.completed } : item
        );
        return { ...exam, checklist: updatedChecklist };
      }
      return exam;
    });
    setExams(updated);
    saveStoredExams(updated);
  };

  const handleAddExamChecklistTask = (examId: string, taskTitle: string) => {
    const updated = exams.map((exam) => {
      if (exam.id === examId) {
        const newItem = {
          id: `chk-${Date.now()}`,
          task: taskTitle,
          completed: false,
        };
        return { ...exam, checklist: [...exam.checklist, newItem] };
      }
      return exam;
    });
    setExams(updated);
    saveStoredExams(updated);
  };

  // Reload state from local storage
  const handleRefreshFromStorage = () => {
    setProfile(getStoredProfile());
    setCourses(getStoredCourses());
    setAssignments(getStoredAssignments());
    setSessions(getStoredSessions());
    setExams(getStoredExams());
    setNotifications(getStoredNotifications());
    setStreak(getStoredStreak());
    setBadges(getStoredBadges());
  };

  // Reset Storage Handler
  const handleResetData = () => {
    if (window.confirm('Reset all StudyFlow demo data to default initial values?')) {
      resetAllToInitial();
      handleRefreshFromStorage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        streak={streak}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        notifications={notifications}
        markNotificationAsRead={handleMarkNotificationAsRead}
        markAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Main Container Layout */}
      {activeTab === 'landing' ? (
        <LandingView onGetStarted={() => setActiveTab('dashboard')} />
      ) : (
        <div className="pt-20 pb-20 md:pb-8 flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-8">
          
          {/* Sidebar Navigation */}
          <Sidebar
            currentView={activeTab}
            activeTab={activeTab}
            setCurrentView={setActiveTab}
            setActiveTab={setActiveTab}
            pendingAssignmentCount={assignments.filter((a) => !a.completed).length}
            upcomingExamCount={exams.length}
          />

          {/* Main Content View */}
          <main className="flex-1 min-w-0">
            {activeTab === 'dashboard' && (
              <DashboardView
                profile={profile}
                courses={courses}
                assignments={assignments}
                exams={exams}
                sessions={sessions}
                setCurrentView={setActiveTab}
                onNavigate={setActiveTab}
                toggleAssignmentComplete={handleToggleAssignmentComplete}
                onToggleAssignment={handleToggleAssignmentComplete}
                onOpenQuickAdd={() => setIsQuickAddOpen(true)}
                streak={streak}
              />
            )}

            {activeTab === 'courses' && (
              <CoursesView
                courses={courses}
                assignments={assignments}
                onAddCourse={handleAddCourse}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleDeleteCourse}
              />
            )}

            {activeTab === 'assignments' && (
              <AssignmentTrackerView
                assignments={assignments}
                courses={courses}
                onAddAssignment={handleAddAssignment}
                onEditAssignment={handleEditAssignment}
                onDeleteAssignment={handleDeleteAssignment}
                onToggleComplete={handleToggleAssignmentComplete}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'planner' && (
              <PlannerView
                sessions={sessions}
                courses={courses}
                onAddSession={handleAddSession}
                onDeleteSession={handleDeleteSession}
                onToggleSessionComplete={handleToggleSessionComplete}
              />
            )}

            {activeTab === 'exams' && (
              <ExamCenterView
                exams={exams}
                courses={courses}
                onAddExam={handleAddExam}
                onEditExam={handleEditExam}
                onDeleteExam={handleDeleteExam}
                onToggleChecklistTask={handleToggleExamChecklistTask}
                onAddChecklistTask={handleAddExamChecklistTask}
              />
            )}

            {activeTab === 'analytics' && (
              <ProgressDashboardView
                profile={profile}
                assignments={assignments}
                courses={courses}
                sessions={sessions}
                achievements={badges}
                streak={7}
              />
            )}

            {activeTab === 'ai-assistant' && (
              <AiAssistantView profile={profile} courses={courses} />
            )}

            {activeTab === 'system' && <SystemArchitectureView />}

            {activeTab === 'profile' && (
              <ProfileView
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onResetData={handleResetData}
                onDataRestored={handleRefreshFromStorage}
              />
            )}
          </main>

        </div>
      )}

      {/* Global Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        courses={courses}
        onAddAssignment={handleAddAssignment}
        onAddCourse={handleAddCourse}
        onAddExam={handleAddExam}
        onAddSession={handleAddSession}
      />

    </div>
  );
}
