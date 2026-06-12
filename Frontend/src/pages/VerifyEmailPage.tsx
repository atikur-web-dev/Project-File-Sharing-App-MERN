// src/pages/VerifyEmailPage.tsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { verifyEmailApi } from '../api/authApi';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { Button } from '../components/common/Button';
import { ROUTES } from '../lib/constants';

const VerifyEmailPage = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('pending');
      return;
    }
    const verify = async () => {
      setStatus('loading');
      try {
        const result = await verifyEmailApi(token);
        setMessage(result.message);
        setStatus(result.success ? 'success' : 'error');
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'Verification failed');
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  if (status === 'pending') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-margin-mobile">
        <div className="mb-xl text-center">
          <span className="text-headline-md font-bold tracking-tighter text-primary">DevShare</span>
        </div>
        <div className="w-full max-w-[440px] rounded-lg border border-outline-variant bg-surface-container-lowest p-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-lg rounded-full bg-surface-container-low p-md">
              <MaterialIcon name="mail" className="text-primary" size={48} />
            </div>
            <h1 className="mb-sm text-headline-lg text-on-background">Check your inbox</h1>
            <p className="mb-lg max-w-[320px] text-body-md leading-relaxed text-on-surface-variant">
              We&apos;ve sent a verification link to your email. Click the link to activate your account.
            </p>
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary">Go to Login</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-margin-mobile">
      <div className="w-full max-w-[440px] rounded-lg border border-outline-variant bg-surface-container-lowest p-xl text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-md py-xl">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
            <p className="text-body-md text-on-surface-variant">Verifying your email...</p>
          </div>
        )}
        {status === 'success' && (
          <>
            <MaterialIcon name="check_circle" className="mb-md text-secondary" size={48} filled />
            <h1 className="mb-sm text-headline-lg text-primary">Email verified</h1>
            <p className="mb-lg text-body-md text-on-surface-variant">{message}</p>
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" fullWidth>Continue to Login</Button>
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <MaterialIcon name="error" className="mb-md text-error" size={48} />
            <h1 className="mb-sm text-headline-lg text-primary">Verification failed</h1>
            <p className="mb-lg text-body-md text-on-surface-variant">{message}</p>
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" fullWidth>Back to Login</Button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
};

export default VerifyEmailPage;
