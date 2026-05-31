// src/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, KeyIcon, CalendarIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { Navbar } from '../components/layout/Navbar';
import { ProfileForm } from '../components/profile/ProfileForm';
import { ChangePasswordForm } from '../components/profile/ChangePasswordForm';
import { Card } from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../lib/utils';
import type { User } from '../types';

type ActiveTab = 'profile' | 'security';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Account Settings
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-1">
            Manage your profile and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-linear-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">{user?.displayName}</h3>
                <p className="text-sm text-slate-400">{user?.email}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-400">Member since</span>
                  <span className="text-white ml-auto">
                    {user?.createdAt ? formatDate(user.createdAt, 'short') : 'Recently'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <IdentificationIcon className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-400">Account ID</span>
                  <span className="text-white ml-auto font-mono text-xs truncate max-w-30">
                    {user?._id}
                  </span>
                </div>
              </div>
            </Card>

            <div className="mt-4 space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Profile Information</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'security'
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <KeyIcon className="w-5 h-5" />
                <span>Security</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            {activeTab === 'profile' ? (
              <ProfileForm onSuccess={handleProfileUpdate} />
            ) : (
              <ChangePasswordForm />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;