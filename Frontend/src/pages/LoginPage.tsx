// src/pages/LoginPage.tsx
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { ROUTES } from '../lib/constants';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-margin-mobile md:px-0">
      <div className="mb-xl text-center">
        <h1 className="mb-xs text-headline-lg tracking-tight text-primary">DevShare</h1>
        <p className="text-body-sm text-on-surface-variant">Precision File Management for Teams</p>
      </div>

      <LoginForm
        onSuccess={() => navigate(ROUTES.DASHBOARD)}
        onRegisterClick={() => navigate(ROUTES.REGISTER)}
        onForgotPasswordClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
      />

      <div className="mt-xl flex items-center gap-lg">
        <div className="flex items-center gap-xs">
          <div className="h-2 w-2 rounded-full bg-secondary" />
          <span className="text-label-md text-on-surface-variant">All systems operational</span>
        </div>
        <a href="#" className="text-label-md text-on-surface-variant transition-colors hover:text-primary">
          Privacy Policy
        </a>
      </div>
    </main>
  );
};

export default LoginPage;
