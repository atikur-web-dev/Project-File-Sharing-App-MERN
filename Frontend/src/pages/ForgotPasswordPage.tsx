// src/pages/ForgotPasswordPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordResetApi } from '../api/authApi';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { Button } from '../components/common/Button';
import { ROUTES } from '../lib/constants';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await requestPasswordResetApi(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-margin-mobile">
      <div className="w-full max-w-[400px] rounded-lg border border-outline-variant bg-surface-container-lowest p-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <div className="mb-xl flex flex-col items-center">
          <span className="text-headline-md font-bold tracking-tight text-primary">DevShare</span>
          <h1 className="mt-md text-center text-headline-lg text-primary">Reset your password</h1>
          <p className="mt-xs text-center text-body-sm text-on-surface-variant">
            {sent
              ? 'Check your inbox for a reset link.'
              : 'Enter your email and we will send you a reset link.'}
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center space-y-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container">
              <MaterialIcon name="check_circle" className="text-on-secondary-container" size={24} filled />
            </div>
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" fullWidth>
                Back to login
              </Button>
            </Link>
          </div>
        ) : (
          <form className="space-y-lg" onSubmit={handleSubmit}>
            {error && (
              <p className="text-center text-label-sm text-error">{error}</p>
            )}
            <div className="space-y-xs">
              <label className="text-label-md text-on-surface-variant" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="stitch-input"
              />
            </div>
            <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="mt-xl flex justify-center border-t border-outline-variant pt-lg">
          <Link
            to={ROUTES.LOGIN}
            className="flex items-center gap-xs text-label-md text-on-surface-variant transition-colors hover:text-primary"
          >
            <MaterialIcon name="arrow_back" size={14} />
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
