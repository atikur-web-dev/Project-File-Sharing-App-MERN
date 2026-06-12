// src/pages/ProfilePage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProfileForm } from '../components/profile/ProfileForm';
import { ChangePasswordForm } from '../components/profile/ChangePasswordForm';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../lib/utils';
import { ROUTES } from '../lib/constants';
import type { User } from '../types';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate(ROUTES.LOGIN);
  }, [authLoading, isAuthenticated, navigate]);

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (authLoading) {
    return (
      <DashboardLayout activeNav="settings" showFooter={false}>
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const initials = user?.displayName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <DashboardLayout activeNav="settings">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-surface/80 px-margin-desktop py-lg backdrop-blur-md">
        <div>
          <h2 className="text-headline-lg text-primary">Account Settings</h2>
          <p className="mt-xs text-body-md text-on-surface-variant">
            Manage your personal information and security preferences.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-xl px-margin-desktop pb-xl">
        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg" id="personal-info">
          <div className="mb-lg flex items-center gap-sm border-b border-outline-variant pb-sm">
            <MaterialIcon name="person" className="text-primary" size={24} />
            <h3 className="text-headline-md text-primary">Personal Information</h3>
          </div>
          <div className="mb-lg flex items-center gap-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-lg font-bold text-primary">
              {initials}
            </div>
            <div>
              <p className="text-body-md font-bold text-primary">{user?.displayName}</p>
              <p className="text-body-sm text-on-surface-variant">{user?.email}</p>
              <p className="mt-1 font-mono text-label-sm text-on-surface-variant">
                Member since {user?.createdAt ? formatDate(user.createdAt, 'short') : 'Recently'}
              </p>
            </div>
          </div>
          <ProfileForm onSuccess={handleProfileUpdate} />
        </section>

        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg" id="security">
          <div className="mb-lg flex items-center gap-sm border-b border-outline-variant pb-sm">
            <MaterialIcon name="security" className="text-primary" size={24} />
            <h3 className="text-headline-md text-primary">Security Settings</h3>
          </div>
          <ChangePasswordForm />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
