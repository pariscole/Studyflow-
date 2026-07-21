import {
  Assignment,
  Course,
  Exam,
  NotificationItem,
  StudentProfile,
  StudySession,
  AchievementBadge,
  StudyNote,
  HabitItem,
} from '../types';
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_COURSES,
  INITIAL_EXAMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILE,
  INITIAL_STUDY_SESSIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_NOTES,
  INITIAL_HABITS,
} from '../data/initialData';

const KEYS = {
  PROFILE: 'studyflow_profile_v1',
  COURSES: 'studyflow_courses_v1',
  ASSIGNMENTS: 'studyflow_assignments_v1',
  EXAMS: 'studyflow_exams_v1',
  SESSIONS: 'studyflow_sessions_v1',
  NOTIFICATIONS: 'studyflow_notifications_v1',
  ACHIEVEMENTS: 'studyflow_achievements_v1',
  STREAK: 'studyflow_streak_v1',
  DARK_MODE: 'studyflow_dark_mode_v1',
  NOTES: 'studyflow_notes_v1',
  HABITS: 'studyflow_habits_v1',
};

export const getStoredProfile = (): StudentProfile => {
  try {
    const item = localStorage.getItem(KEYS.PROFILE);
    return item ? JSON.parse(item) : INITIAL_PROFILE;
  } catch {
    return INITIAL_PROFILE;
  }
};

export const saveStoredProfile = (profile: StudentProfile) => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const getStoredCourses = (): Course[] => {
  try {
    const item = localStorage.getItem(KEYS.COURSES);
    return item ? JSON.parse(item) : INITIAL_COURSES;
  } catch {
    return INITIAL_COURSES;
  }
};

export const saveStoredCourses = (courses: Course[]) => {
  localStorage.setItem(KEYS.COURSES, JSON.stringify(courses));
};

export const getStoredAssignments = (): Assignment[] => {
  try {
    const item = localStorage.getItem(KEYS.ASSIGNMENTS);
    return item ? JSON.parse(item) : INITIAL_ASSIGNMENTS;
  } catch {
    return INITIAL_ASSIGNMENTS;
  }
};

export const saveStoredAssignments = (assignments: Assignment[]) => {
  localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(assignments));
};

export const getStoredExams = (): Exam[] => {
  try {
    const item = localStorage.getItem(KEYS.EXAMS);
    return item ? JSON.parse(item) : INITIAL_EXAMS;
  } catch {
    return INITIAL_EXAMS;
  }
};

export const saveStoredExams = (exams: Exam[]) => {
  localStorage.setItem(KEYS.EXAMS, JSON.stringify(exams));
};

export const getStoredSessions = (): StudySession[] => {
  try {
    const item = localStorage.getItem(KEYS.SESSIONS);
    return item ? JSON.parse(item) : INITIAL_STUDY_SESSIONS;
  } catch {
    return INITIAL_STUDY_SESSIONS;
  }
};

export const saveStoredSessions = (sessions: StudySession[]) => {
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
};

export const getStoredNotifications = (): NotificationItem[] => {
  try {
    const item = localStorage.getItem(KEYS.NOTIFICATIONS);
    return item ? JSON.parse(item) : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveStoredNotifications = (notifs: NotificationItem[]) => {
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
};

export const getStoredAchievements = (): AchievementBadge[] => {
  try {
    const item = localStorage.getItem(KEYS.ACHIEVEMENTS);
    return item ? JSON.parse(item) : INITIAL_ACHIEVEMENTS;
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
};

export const saveStoredAchievements = (achievements: AchievementBadge[]) => {
  localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
};

export const getStoredStreak = (): number => {
  try {
    const item = localStorage.getItem(KEYS.STREAK);
    return item ? parseInt(item, 10) : 5;
  } catch {
    return 5;
  }
};

export const saveStoredStreak = (streak: number) => {
  localStorage.setItem(KEYS.STREAK, streak.toString());
};

export const getStoredDarkMode = (): boolean => {
  try {
    const item = localStorage.getItem(KEYS.DARK_MODE);
    return item ? JSON.parse(item) : false;
  } catch {
    return false;
  }
};

export const saveStoredDarkMode = (isDark: boolean) => {
  localStorage.setItem(KEYS.DARK_MODE, JSON.stringify(isDark));
};

export const getStoredNotes = (): StudyNote[] => {
  try {
    const item = localStorage.getItem(KEYS.NOTES);
    return item ? JSON.parse(item) : INITIAL_NOTES;
  } catch {
    return INITIAL_NOTES;
  }
};

export const saveStoredNotes = (notes: StudyNote[]) => {
  localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
};

export const getStoredHabits = (): HabitItem[] => {
  try {
    const item = localStorage.getItem(KEYS.HABITS);
    return item ? JSON.parse(item) : INITIAL_HABITS;
  } catch {
    return INITIAL_HABITS;
  }
};

export const saveStoredHabits = (habits: HabitItem[]) => {
  localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
};

export const calculateCumulativeGpa = (courses: Course[]): number => {
  if (!courses || courses.length === 0) return 4.0;

  let totalCredits = 0;
  let totalPoints = 0;

  for (const course of courses) {
    const credits = course.credits || 3;
    const gradePercent = course.currentGrade;
    let gradePoints = 4.0;

    if (gradePercent >= 93) gradePoints = 4.0;
    else if (gradePercent >= 90) gradePoints = 3.7;
    else if (gradePercent >= 87) gradePoints = 3.3;
    else if (gradePercent >= 83) gradePoints = 3.0;
    else if (gradePercent >= 80) gradePoints = 2.7;
    else if (gradePercent >= 77) gradePoints = 2.3;
    else if (gradePercent >= 73) gradePoints = 2.0;
    else if (gradePercent >= 70) gradePoints = 1.7;
    else if (gradePercent >= 65) gradePoints = 1.0;
    else gradePoints = 0.0;

    totalPoints += gradePoints * credits;
    totalCredits += credits;
  }

  if (totalCredits === 0) return 4.0;
  return Number((totalPoints / totalCredits).toFixed(2));
};

export const resetAllDemoData = () => {
  localStorage.removeItem(KEYS.PROFILE);
  localStorage.removeItem(KEYS.COURSES);
  localStorage.removeItem(KEYS.ASSIGNMENTS);
  localStorage.removeItem(KEYS.EXAMS);
  localStorage.removeItem(KEYS.SESSIONS);
  localStorage.removeItem(KEYS.NOTIFICATIONS);
  localStorage.removeItem(KEYS.ACHIEVEMENTS);
  localStorage.removeItem(KEYS.STREAK);
  localStorage.removeItem(KEYS.DARK_MODE);
  localStorage.removeItem(KEYS.NOTES);
  localStorage.removeItem(KEYS.HABITS);
};

export interface StudyFlowBackupData {
  version: string;
  exportedAt: string;
  data: {
    profile?: StudentProfile;
    courses?: Course[];
    assignments?: Assignment[];
    exams?: Exam[];
    sessions?: StudySession[];
    notifications?: NotificationItem[];
    achievements?: AchievementBadge[];
    notes?: StudyNote[];
    habits?: HabitItem[];
    streak?: number;
    darkMode?: boolean;
  };
}

export const exportBackupData = (): StudyFlowBackupData => {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    data: {
      profile: getStoredProfile(),
      courses: getStoredCourses(),
      assignments: getStoredAssignments(),
      exams: getStoredExams(),
      sessions: getStoredSessions(),
      notifications: getStoredNotifications(),
      achievements: getStoredAchievements(),
      notes: getStoredNotes(),
      habits: getStoredHabits(),
      streak: getStoredStreak(),
      darkMode: getStoredDarkMode(),
    },
  };
};

export const restoreBackupData = (backup: any): boolean => {
  try {
    if (!backup || typeof backup !== 'object') return false;

    // Support both full wrapper format and direct data format
    const content = backup.data || backup;

    if (content.profile) saveStoredProfile(content.profile);
    if (Array.isArray(content.courses)) saveStoredCourses(content.courses);
    if (Array.isArray(content.assignments)) saveStoredAssignments(content.assignments);
    if (Array.isArray(content.exams)) saveStoredExams(content.exams);
    if (Array.isArray(content.sessions)) saveStoredSessions(content.sessions);
    if (Array.isArray(content.notifications)) saveStoredNotifications(content.notifications);
    if (Array.isArray(content.achievements)) saveStoredAchievements(content.achievements);
    if (Array.isArray(content.notes)) saveStoredNotes(content.notes);
    if (Array.isArray(content.habits)) saveStoredHabits(content.habits);
    if (typeof content.streak === 'number') saveStoredStreak(content.streak);
    if (typeof content.darkMode === 'boolean') saveStoredDarkMode(content.darkMode);

    return true;
  } catch (err) {
    console.error('Failed to restore backup data:', err);
    return false;
  }
};
