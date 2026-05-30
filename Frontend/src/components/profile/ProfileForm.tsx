// src/components/profile/ProfileForm.tsx
import { useState } from 'react';
import { UserIcon, EnvelopeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { updateProfileApi } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../types';

interface ProfileFormProps {
  onSuccess: (updatedUser: User) => void;
}

export const ProfileForm = ({ onSuccess }: ProfileFormProps) => {
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    if (displayName.trim().length < 3) {
      setError('Display name must be at least 3 characters');
      return;
    }

    if (displayName.trim() === user?.displayName) {
      setError('No changes detected');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedUser = await updateProfileApi({ displayName: displayName.trim() });
      setUser(updatedUser);
      onSuccess(updatedUser);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/5 border-white/10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>

          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={user?.email || ''}
              disabled
              leftIcon={<EnvelopeIcon className="w-5 h-5" />}
              helperText="Email cannot be changed"
            />

            <Input
              label="Display Name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              leftIcon={<UserIcon className="w-5 h-5" />}
              error={error || undefined}
              placeholder="Your display name"
            />
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            {user?.emailVerification ? (
              <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
            ) : (
              <XCircleIcon className="w-5 h-5 text-yellow-500 shrink-0" />
            )}
            <div>
              <p className="text-sm font-medium text-white">Email Verification Status</p>
              <p className="text-xs text-slate-400">
                {user?.emailVerification
                  ? 'Your email has been verified'
                  : 'Please verify your email address'}
              </p>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-400 text-center">{successMessage}</p>
          </div>
        )}

        <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
          Save Changes
        </Button>
      </form>
    </Card>
  );
};