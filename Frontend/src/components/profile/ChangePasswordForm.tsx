// src/components/profile/ChangePasswordForm.tsx
import { useState } from 'react';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { changePasswordApi } from '../../api/authApi';

export const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setError('Current password is required');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await changePasswordApi({ currentPassword, newPassword });
      setSuccessMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password change failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/5 border-white/10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>

          <div className="space-y-4">
            <Input
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              leftIcon={<LockClosedIcon className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="focus:outline-none"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-slate-400 hover:text-slate-300" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              }
              placeholder="Enter current password"
            />

            <Input
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              leftIcon={<LockClosedIcon className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="focus:outline-none"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-slate-400 hover:text-slate-300" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              }
              placeholder="Enter new password"
            />

            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<LockClosedIcon className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-slate-400 hover:text-slate-300" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              }
              placeholder="Confirm new password"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-400 text-center">{successMessage}</p>
          </div>
        )}

        <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
          Change Password
        </Button>
      </form>
    </Card>
  );
};
