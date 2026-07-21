import React, { useState, useRef } from 'react';
import {
  User,
  GraduationCap,
  Target,
  Clock,
  BookOpen,
  Edit3,
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
  Calendar,
  Download,
  Upload,
  Database,
  AlertCircle,
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { exportBackupData, restoreBackupData } from '../../lib/storage';

interface ProfileViewProps {
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  onResetData: () => void;
  onDataRestored?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onResetData,
  onDataRestored,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backupStatus, setBackupStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExport = () => {
    const backup = exportBackupData();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const today = new Date().toISOString().split('T')[0];
    link.download = `studyflow_backup_${today}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setBackupStatus({ type: 'success', message: 'Backup file exported successfully!' });
    setTimeout(() => setBackupStatus(null), 4000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const success = restoreBackupData(parsed);

        if (success) {
          setBackupStatus({ type: 'success', message: 'Data restored successfully from backup file!' });
          if (onDataRestored) {
            onDataRestored();
          }
        } else {
          setBackupStatus({ type: 'error', message: 'Invalid backup file format. Could not restore data.' });
        }
      } catch {
        setBackupStatus({ type: 'error', message: 'Failed to read backup file. Please ensure it is valid JSON.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setTimeout(() => setBackupStatus(null), 5000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Student Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal academic goals, major, and study preferences.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-colors flex items-center space-x-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* User Info Header */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-100 dark:border-slate-700/60 text-center sm:text-left">
          <img
            src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={profile.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-sky-500/20 shadow-md"
          />
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{profile.name}</h2>
            <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">{profile.major}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.semester} • Expected Graduation {profile.gradYear}
            </p>
          </div>
        </div>

        {/* Profile Content / Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Major / Degree</label>
                <input
                  type="text"
                  required
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Semester & Year</label>
                <input
                  type="text"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={formData.gradYear}
                  onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">GPA Goal</label>
                <input
                  type="number"
                  step="0.05"
                  min="2.0"
                  max="4.0"
                  value={formData.gpaGoal}
                  onChange={(e) => setFormData({ ...formData, gpaGoal: parseFloat(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Current GPA</label>
                <input
                  type="number"
                  step="0.05"
                  min="2.0"
                  max="4.0"
                  value={formData.currentGpa}
                  onChange={(e) => setFormData({ ...formData, currentGpa: parseFloat(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Favorite Study Time</label>
                <input
                  type="text"
                  value={formData.favoriteStudyTime}
                  onChange={(e) => setFormData({ ...formData, favoriteStudyTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Learning Style</label>
                <input
                  type="text"
                  value={formData.preferredLearningStyle}
                  onChange={(e) => setFormData({ ...formData, preferredLearningStyle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md shadow-sky-500/20"
              >
                Save Profile
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-purple-500" />
                <span>GPA Target</span>
              </span>
              <p className="text-xl font-black text-slate-900 dark:text-slate-100">
                {profile.currentGpa} <span className="text-xs text-slate-400 font-normal">/ Goal {profile.gpaGoal}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                <span>Favorite Study Time</span>
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{profile.favoriteStudyTime}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>Preferred Learning Style</span>
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{profile.preferredLearningStyle}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Graduation Target</span>
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Class of {profile.gradYear}</p>
            </div>

          </div>
        )}

        {backupStatus && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 border ${
              backupStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200'
            }`}
          >
            {backupStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{backupStatus.message}</span>
          </div>
        )}

        {/* Data Backup & Restore Section */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-700/60 space-y-4">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-sky-500" />
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Backup and Restore Application Data
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Export your courses, assignments, study plans, and profile as a JSON file to transfer or preserve your data.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleExport}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Backup (JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Restore from Backup</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
        </div>

        {/* Reset Demo Data Action */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Reset Sample Demo Data</h4>
            <p className="text-xs text-slate-500">
              Restore default courses, assignments, exams, and study sessions in localStorage.
            </p>
          </div>
          <button
            onClick={onResetData}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center space-x-1.5 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Demo Data</span>
          </button>
        </div>

      </div>

    </div>
  );
};
