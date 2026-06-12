// src/pages/UploadPage.tsx
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { FileUpload } from '../components/files/FileUpload';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../lib/constants';
import { showToast } from '../components/common/Toast';
import type { FileUploadResponse } from '../types';

const UploadPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleUploadSuccess = (uploadedFiles: FileUploadResponse[]) => {
    showToast.success(
      `Successfully uploaded ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''}`
    );
    navigate(ROUTES.DASHBOARD);
  };

  if (authLoading) {
    return (
      <DashboardLayout activeNav="files" showFooter={false}>
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeNav="files" compactFooter>
      <header className="flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-xl">
        <h2 className="text-headline-md text-primary">Upload Files</h2>
      </header>

      <div className="mx-auto w-full max-w-6xl flex-1 overflow-y-auto p-xl">
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
