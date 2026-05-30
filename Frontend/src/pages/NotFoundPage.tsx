// src/pages/NotFoundPage.tsx
import { useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/common/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-8xl sm:text-9xl font-bold text-white/10">404</h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-4">Page Not Found</h2>
        <p className="text-slate-400 mt-2 max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            leftIcon={<HomeIcon className="w-5 h-5" />}
          >
            Go Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeftIcon className="w-5 h-5" />}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;