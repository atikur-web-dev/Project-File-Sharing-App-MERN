// src/pages/AnalyticsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownTrayIcon,
  DocumentIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/common/Card';
import { DownloadChart } from '../components/analytics/DownloadChart';
import { useAuth } from '../hooks/useAuth';
import { getDownloadStatsApi, type DownloadStats } from '../api/analyticsApi';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [stats, setStats] = useState<DownloadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadStats = async () => {
      setIsLoading(true);
      try {
        const data = await getDownloadStatsApi();
        setStats(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [isAuthenticated]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const topFile = stats?.filesByDownloads[0];
  const totalDownloads = stats?.totalDownloads || 0;
  const filesWithDownloads = stats?.filesByDownloads.filter((f) => f.downloadCount > 0).length || 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-1">
            Track your file download statistics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <ArrowDownTrayIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white">{totalDownloads}</p>
                <p className="text-sm text-slate-400">Total Downloads</p>
              </div>
            </div>
          </Card>

          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DocumentIcon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white">{filesWithDownloads}</p>
                <p className="text-sm text-slate-400">Files Downloaded</p>
              </div>
            </div>
          </Card>

          <Card className="backdrop-blur-xl bg-white/5 border-white/10 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-400 mb-1">Most Popular File</p>
                {topFile && topFile.downloadCount > 0 ? (
                  <>
                    <p className="text-white font-medium truncate" title={topFile.fileName}>
                      {topFile.fileName}
                    </p>
                    <p className="text-xs text-slate-500">{topFile.downloadCount} downloads</p>
                  </>
                ) : (
                  <p className="text-slate-400">No downloads yet</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <ArrowTrendingUpIcon className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-white">Downloads by File</h2>
          </div>

          {stats?.filesByDownloads && stats.filesByDownloads.length > 0 ? (
            <DownloadChart data={stats.filesByDownloads} />
          ) : (
            <div className="flex items-center justify-center h-80 text-slate-400">
              Upload and share files to see download analytics
            </div>
          )}
        </Card>

        <div className="mt-6">
          <p className="text-xs text-slate-500 text-center">
            Analytics update in real-time &middot; Data refreshed on each page load
          </p>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;