export type Priority = 'high' | 'medium' | 'low';
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type ExamDifficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Hardcore';

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  currentGrade: number; // percentage e.g. 94.5
  letterGrade?: string;
  remainingAssignments: number;
  nextClass: string;
  color: string; // tailwind color theme e.g. 'sky', 'purple', 'emerald', 'amber', 'rose', 'indigo'
  schedule: string; // e.g. 'Mon, Wed 10:00 AM - 11:30 AM'
  room: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  priority: Priority;
  completed: boolean;
  notes?: string;
  estimatedMinutes?: number;
  score?: string; // e.g. "95/100"
}

export interface ExamChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  examDate: string; // ISO date string or YYYY-MM-DD THH:mm
  location: string;
  difficulty: ExamDifficulty;
  readinessPercentage: number;
  checklist: ExamChecklistItem[];
  studyGoalHours: number;
}

export interface StudySession {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // e.g. '14:00'
  durationMinutes: number;
  goal: string;
  completed: boolean;
  color: string;
}

export interface StudentProfile {
  name: string;
  major: string;
  semester: string;
  gradYear: string;
  gpaGoal: number;
  currentGpa: number;
  favoriteStudyTime: string;
  preferredLearningStyle: string;
  avatarUrl?: string;
  bio?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'exam' | 'session' | 'deadline';
  date: string;
  read: boolean;
  targetView?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'assignments' | 'gpa' | 'hours';
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  courseId?: string;
  courseName?: string;
  createdAt: string;
  tags?: string[];
  pinned?: boolean;
}

export interface HabitItem {
  id: string;
  title: string;
  category: 'study' | 'wellness' | 'focus';
  completedDates: string[]; // array of YYYY-MM-DD
  targetDaysPerWeek: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  mode?: string;
  suggestedActions?: string[];
}

export type ViewMode =
  | 'landing'
  | 'dashboard'
  | 'courses'
  | 'assignments'
  | 'planner'
  | 'exams'
  | 'analytics'
  | 'ai-assistant'
  | 'profile'
  | 'system';

export type NavTab = ViewMode;
