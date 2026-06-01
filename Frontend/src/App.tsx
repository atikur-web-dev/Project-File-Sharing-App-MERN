// src/App.tsx
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { AuthProvider } from "./contexts/AuthProvider";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { PageTransition } from "./components/common/PageTransition";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const FileSharePage = lazy(() => import("./pages/FileSharePage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-700 border-t-primary-600 rounded-full animate-spin" />
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
                className: "dark:bg-gray-800 dark:text-white",
              }}
            />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Home page - NO LAYOUT (has its own nav) */}
                <Route
                  path="/"
                  element={
                    <PageTransition>
                      <HomePage />
                    </PageTransition>
                  }
                />

                {/* Auth pages - AuthLayout (no nav, just centered forms) */}
                <Route element={<AuthLayout />}>
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
                </Route>

                {/* Dashboard pages - MainLayout (has Navbar) */}
                <Route element={<MainLayout />}>
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
                </Route>

                {/* Public share page - NO LAYOUT (clean view for sharing) */}
                <Route
                  path="/share/:uuid"
                  element={
                    <PageTransition>
                      <FileSharePage />
                    </PageTransition>
                  }
                />

                {/* 404 - NO LAYOUT */}
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
