
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit, isLoading }) => {
  const [profile, setProfile] = useState<UserProfile>({
    age: '',
    occupation: '',
    education: '',
    goals: '',
    challenges: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Cast v to string as Object.values can return unknown[] in strict TS environments
    if (Object.values(profile).some(v => (v as string).trim() === '')) return;
    onSubmit(profile);
  };

  const inputClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-100 placeholder-slate-500";
  const labelClasses = "block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto glass-panel p-8 rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-white mb-2">Initialize Your Journey</h2>
        <p className="text-slate-400">Tell us where you are now, and AI will show you where you could be.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Current Age</label>
          <input
            type="number"
            placeholder="e.g. 25"
            className={inputClasses}
            value={profile.age}
            onChange={e => setProfile({ ...profile, age: e.target.value })}
            required
          />
        </div>
        <div>
          <label className={labelClasses}>Current Role</label>
          <input
            type="text"
            placeholder="e.g. Graphic Designer"
            className={inputClasses}
            value={profile.occupation}
            onChange={e => setProfile({ ...profile, occupation: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Education / Skills</label>
        <input
          type="text"
          placeholder="e.g. BFA in Design, Self-taught UI"
          className={inputClasses}
          value={profile.education}
          onChange={e => setProfile({ ...profile, education: e.target.value })}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>Ambitions & Goals</label>
        <textarea
          rows={3}
          placeholder="What does success look like to you?"
          className={inputClasses}
          value={profile.goals}
          onChange={e => setProfile({ ...profile, goals: e.target.value })}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>Current Blockers</label>
        <textarea
          rows={3}
          placeholder="What's holding you back today?"
          className={inputClasses}
          value={profile.challenges}
          onChange={e => setProfile({ ...profile, challenges: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <><i className="fas fa-circle-notch animate-spin"></i> Calculating Future Paths...</>
        ) : (
          <><i className="fas fa-crystal-ball"></i> Generate Future Paths</>
        )}
      </button>
    </form>
  );
};
