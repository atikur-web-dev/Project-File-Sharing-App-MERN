// src/pages/AnalyticsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DownloadChart } from '../components/analytics/DownloadChart';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { useAuth } from '../hooks/useAuth';
import { getDownloadStatsApi, type DownloadStats } from '../api/analyticsApi';
import { ROUTES } from '../lib/constants';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DownloadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate(ROUTES.LOGIN);
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadStats = async () => {
      setIsLoading(true);
      try {
        setStats(await getDownloadStatsApi());
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
      <DashboardLayout activeNav="analytics" showFooter={false}>
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const topFile = stats?.filesByDownloads[0];
  const totalDownloads = stats?.totalDownloads || 0;
  const filesWithDownloads = stats?.filesByDownloads.filter((f) => f.downloadCount > 0).length || 0;

  return (
    <DashboardLayout activeNav="analytics">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-white px-xl">
        <div className="flex items-center gap-md">
          <h1 className="text-headline-md font-bold tracking-tight text-primary">Storage Analytics</h1>
          <span className="rounded border border-outline-variant bg-surface-container-low px-sm py-xs font-mono text-label-md text-on-surface-variant">
            Real-time
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-xl p-xl">
        <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-lg border border-outline-variant bg-white p-lg lg:col-span-3">
            <div className="flex items-start justify-between">
              <span className="font-mono text-label-md uppercase tracking-wider text-on-surface-variant">
                Total Downloads
              </span>
              <MaterialIcon name="cloud_done" className="text-secondary" size={24} />
            </div>
            <div className="mt-md">
              <h2 className="text-display font-bold">{totalDownloads}</h2>
              <p className="mt-xs text-body-sm font-medium text-secondary">All-time downloads</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg border border-outline-variant bg-white p-lg lg:col-span-3">
            <div className="flex items-start justify-between">
              <span className="font-mono text-label-md uppercase tracking-wider text-on-surface-variant">
                Active Files
              </span>
              <MaterialIcon name="drafts" className="text-primary" size={24} />
            </div>
            <div className="mt-md">
              <h2 className="text-display font-bold">{filesWithDownloads}</h2>
              <p className="mt-xs text-body-sm text-on-surface-variant opacity-60">Files with downloads</p>
            </div>
          </div>

          <div className="rounded-lg border border-outline-variant bg-white p-lg lg:col-span-6">
            <div className="mb-lg flex items-center justify-between">
              <h3 className="text-headline-md font-bold">Downloads by File</h3>
              {topFile && topFile.downloadCount > 0 && (
                <span className="font-mono text-label-md text-on-surface-variant">
                  Top: {topFile.fileName}
                </span>
              )}
            </div>
            {stats?.filesByDownloads && stats.filesByDownloads.length > 0 ? (
              <DownloadChart data={stats.filesByDownloads} />
            ) : (
              <div className="flex h-40 items-center justify-center text-on-surface-variant">
                Upload and share files to see download analytics
              </div>
            )}
          </div>
        </div>

        {stats?.filesByDownloads && stats.filesByDownloads.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-outline-variant bg-white">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-lg py-md">
              <h3 className="text-headline-md font-bold">Top Files by Downloads</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="px-lg py-sm font-mono text-label-md uppercase text-on-surface-variant">File</th>
                    <th className="px-lg py-sm font-mono text-label-md uppercase text-on-surface-variant">Downloads</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm">
                  {stats.filesByDownloads.slice(0, 10).map((f) => (
                    <tr key={f.uuid} className="border-b border-outline-variant transition-colors last:border-0 hover:bg-surface-container-low">
                      <td className="flex items-center gap-sm px-lg py-sm">
                        <MaterialIcon name="description" size={20} className="text-on-surface-variant" />
                        <span className="font-medium">{f.fileName}</span>
                      </td>
                      <td className="px-lg py-sm font-mono text-label-md">{f.downloadCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
