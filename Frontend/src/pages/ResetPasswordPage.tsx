// src/pages/ResetPasswordPage.tsx
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../api/authApi';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { Button } from '../components/common/Button';
import { ROUTES } from '../lib/constants';

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMatchError(true);
      return;
    }
    if (!token) {
      setError('Invalid reset link');
      return;
    }
    setMatchError(false);
    setIsSubmitting(true);
    setError(null);
    try {
      await resetPasswordApi(token, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center p-margin-mobile">
      <div className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(220, 226, 247, 0.5) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(111, 251, 190, 0.2) 0px, transparent 50%)
          `,
        }}
      />
      <div className="w-full max-w-[400px] rounded-lg border border-outline-variant bg-surface-container-lowest p-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <div className="mb-xl flex flex-col items-center">
          <span className="text-headline-md font-bold text-primary">DevShare</span>
          <h1 className="mt-md text-center text-headline-lg text-primary">Reset your password</h1>
          <p className="mt-xs text-center text-body-sm text-on-surface-variant">
            Enter a strong password to secure your account.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center space-y-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container">
              <MaterialIcon name="check_circle" className="text-on-secondary-container" size={24} filled />
            </div>
            <div className="text-center">
              <h3 className="text-headline-md text-primary">Password updated</h3>
              <p className="mt-xs text-body-sm text-on-surface-variant">
                Your password has been reset successfully.
              </p>
            </div>
            <Button variant="outline" fullWidth onClick={() => navigate(ROUTES.LOGIN)}>
              Go to Login
            </Button>
          </div>
        ) : (
          <form className="space-y-lg" onSubmit={handleSubmit}>
            {error && <p className="text-center text-label-sm text-error">{error}</p>}
            {['new-password', 'confirm-password'].map((fieldId, idx) => {
              const isNew = idx === 0;
              const value = isNew ? newPassword : confirmPassword;
              const setValue = isNew ? setNewPassword : setConfirmPassword;
              const show = isNew ? showNew : showConfirm;
              const setShow = isNew ? setShowNew : setShowConfirm;
              return (
                <div key={fieldId} className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant" htmlFor={fieldId}>
                    {isNew ? 'New Password' : 'Confirm New Password'}
                  </label>
                  <div className="relative">
                    <input
                      id={fieldId}
                      type={show ? 'text' : 'password'}
                      required
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value);
                        setMatchError(false);
                      }}
                      placeholder="••••••••"
                      className="stitch-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                    >
                      <MaterialIcon name={show ? 'visibility_off' : 'visibility'} size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
            {matchError && (
              <p className="text-label-sm text-error">Passwords do not match.</p>
            )}
            <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
              Reset Password
            </Button>
          </form>
        )}

        {!success && (
          <div className="mt-xl flex justify-center border-t border-outline-variant pt-lg">
            <Link
              to={ROUTES.LOGIN}
              className="flex items-center gap-xs text-label-md text-on-surface-variant hover:text-primary"
            >
              <MaterialIcon name="arrow_back" size={14} />
              Back to login
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default ResetPasswordPage;
