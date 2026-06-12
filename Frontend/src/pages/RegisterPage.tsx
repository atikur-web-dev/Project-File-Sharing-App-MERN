// src/pages/RegisterPage.tsx
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { ROUTES } from '../lib/constants';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col overflow-hidden md:flex-row">
      <div className="relative hidden items-center justify-center overflow-hidden bg-primary-container md:flex md:w-1/2 lg:w-3/5">
        <div className="relative z-10 max-w-xl p-margin-desktop">
          <div className="mb-xl">
            <span className="select-none text-headline-lg font-extrabold text-on-primary">DevShare</span>
          </div>
          <h1 className="mb-lg text-display text-white">Build. Share. Scale.</h1>
          <p className="mb-xl text-body-lg leading-relaxed text-primary-fixed-dim">
            The high-performance workspace for modern engineering teams. Manage complex file structures
            with technical precision and speed.
          </p>
          <div className="grid grid-cols-2 gap-lg">
            <div className="flex items-center gap-md">
              <MaterialIcon name="speed" className="text-secondary-fixed" size={32} />
              <div>
                <span className="text-label-md text-white">Latency</span>
                <p className="text-label-sm text-primary-fixed-dim">Sub-50ms sync</p>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <MaterialIcon name="security" className="text-secondary-fixed" size={32} />
              <div>
                <span className="text-label-md text-white">Encryption</span>
                <p className="text-label-sm text-primary-fixed-dim">AES-256 E2EE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex w-full items-center justify-center overflow-y-auto bg-surface p-margin-mobile md:w-1/2 md:p-margin-desktop lg:w-2/5">
        <RegisterForm
          onSuccess={() => navigate(ROUTES.DASHBOARD)}
          onLoginClick={() => navigate(ROUTES.LOGIN)}
        />
      </main>
    </div>
  );
};

export default RegisterPage;
