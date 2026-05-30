// src/App.tsx
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeProvider';
import { AuthProvider } from './contexts/AuthProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PageTransition } from './components/common/PageTransition';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const FileSharePage = lazy(() => import('./pages/FileSharePage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageLoader = () => (
  <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                className: 'dark:bg-gray-800 dark:text-white',
              }}
            />

            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <PageTransition>
                      <HomePage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PageTransition>
                      <LoginPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PageTransition>
                      <RegisterPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PageTransition>
                      <DashboardPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <PageTransition>
                      <AnalyticsPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PageTransition>
                      <ProfilePage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/share/:uuid"
                  element={
                    <PageTransition>
                      <FileSharePage />
                    </PageTransition>
                  }
                />
                <Route
                  path="*"
                  element={
                    <PageTransition>
                      <NotFoundPage />
                    </PageTransition>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;