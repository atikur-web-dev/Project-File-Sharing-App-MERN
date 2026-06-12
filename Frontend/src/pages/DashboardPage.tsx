// src/pages/DashboardPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { FileList } from '../components/files/FileList';
import { Pagination } from '../components/files/Pagination';
import { SortDropdown, type SortField, type SortOrder } from '../components/dashboard/SortDropdown';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { getUserFilesApi, deleteFileApi } from '../api/fileApi';
import { showToast } from '../components/common/Toast';
import { ROUTES } from '../lib/constants';
import type { FileType } from '../types';

const LIMIT = 12;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSharedTab = searchParams.get('tab') === 'shared';
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [files, setFiles] = useState<FileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const response = await getUserFilesApi({
          page: currentPage,
          limit: LIMIT,
          search: debouncedSearch,
          sortBy,
          sortOrder,
        });
        setFiles(response.files);
        setTotalPages(response.pagination.totalPages);
        setTotalFiles(response.pagination.totalFiles);
      } catch {
        showToast.error('Failed to load files');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [isAuthenticated, currentPage, debouncedSearch, sortBy, sortOrder]);

  const handleDeleteFile = async (uuid: string) => {
    try {
      await deleteFileApi(uuid);
      setFiles((prev) => prev.filter((f) => f.uuid !== uuid));
      setTotalFiles((prev) => prev - 1);
      showToast.success('File deleted successfully');
    } catch {
      showToast.error('Failed to delete file');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const firstName = user?.displayName?.split(' ')[0] || 'there';

  return (
    <DashboardLayout activeNav={isSharedTab ? 'shared' : 'files'} compactFooter>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-outline-variant bg-surface-bright px-xl">
        <div className="flex flex-1 items-center gap-lg">
          <h1 className="whitespace-nowrap text-headline-md text-on-surface">
            {isSharedTab ? 'Shared Files' : 'My Files'}
          </h1>
          <div className="relative max-w-md w-full">
            <MaterialIcon
              name="search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search resources..."
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-1.5 pl-10 pr-4 font-mono text-body-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-md">
          <SortDropdown
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={(field, order) => {
              setSortBy(field);
              setSortOrder(order);
              setCurrentPage(1);
            }}
          />
          <button
            type="button"
            onClick={() => navigate(ROUTES.UPLOAD)}
            className="flex items-center gap-1 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 text-body-sm text-on-surface-variant transition-all hover:text-primary"
          >
            <MaterialIcon name="upload_file" size={18} />
            Upload
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-xl">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <LoadingSkeleton key={i} variant="card" className="h-48" />
            ))}
          </div>
        ) : (
          <>
            {!isSharedTab && (
              <div className="mb-xl">
                <h2 className="text-headline-lg text-primary">Welcome back, {firstName}</h2>
                <p className="text-body-md text-on-surface-variant">
                  {totalFiles} {totalFiles === 1 ? 'file' : 'files'} in your workspace
                </p>
              </div>
            )}

            {debouncedSearch && (
              <p className="mb-md text-body-sm text-on-surface-variant">
                Results for &quot;{debouncedSearch}&quot;
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                  className="ml-2 text-secondary hover:underline"
                >
                  Clear
                </button>
              </p>
            )}

            <FileList files={files} isLoading={false} onDelete={handleDeleteFile} />

            {files.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalFiles}
                  itemsPerPage={LIMIT}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
