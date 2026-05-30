// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from '../layout/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;