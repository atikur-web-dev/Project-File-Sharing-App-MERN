// src/pages/DashboardPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderIcon } from '@heroicons/react/24/outline';
import { FileUpload } from '../components/files/FileUpload';
import { FileList } from '../components/files/FileList';
import { Pagination } from '../components/files/Pagination';
import { SearchBar } from '../components/dashboard/SearchBar';
import { SortDropdown, type SortField, type SortOrder } from '../components/dashboard/SortDropdown';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { getUserFilesApi, deleteFileApi } from '../api/fileApi';
import { showToast } from '../components/common/Toast';
import type { FileType, FileUploadResponse } from '../types';

const LIMIT = 12;

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [files, setFiles] = useState<FileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
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
  }, [isAuthenticated, currentPage, debouncedSearch, sortBy, sortOrder, refreshKey]);

  const handleUploadSuccess = (uploadedFiles: FileUploadResponse[]) => {
    showToast.success(
      `Successfully uploaded ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''}`
    );
    setRefreshKey((prev) => prev + 1);
    setSearchTerm('');
    setCurrentPage(1);
  };

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
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <>
          <div className="mb-6 sm:mb-8">
            <LoadingSkeleton variant="text" className="w-48 h-8 mb-2" />
            <LoadingSkeleton variant="text" className="w-64 h-4" />
          </div>
          <LoadingSkeleton variant="card" className="mb-8 h-48" />

          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1">
                <LoadingSkeleton variant="text" className="h-10" />
              </div>
              <div className="w-40">
                <LoadingSkeleton variant="text" className="h-10" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <LoadingSkeleton key={i} variant="card" />
              ))}
            </div>
          </Card>
        </>
      ) : (
        <>
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Welcome back, {user?.displayName?.split(' ')[0]}
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-1">
              Manage and share your files
            </p>
          </div>

          <div className="mb-6 sm:mb-8">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>

          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search by file name..."
                />
              </div>
              <SortDropdown
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={(field, order) => {
                  setSortBy(field);
                  setSortOrder(order);
                  setCurrentPage(1);
                }}
              />
            </div>

            {debouncedSearch && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-slate-400">
                  Search results for: &quot;{debouncedSearch}&quot;
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                >
                  Clear
                </Button>
              </div>
            )}

            {files.length > 0 && (
              <p className="text-sm text-slate-400 mb-4">
                <FolderIcon className="w-4 h-4 inline mr-1" />
                {totalFiles} {totalFiles === 1 ? 'file' : 'files'} total
              </p>
            )}

            <FileList files={files} isLoading={false} onDelete={handleDeleteFile} />

            {files.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalFiles}
                  itemsPerPage={LIMIT}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </Card>
        </>
      )}
    </>
  );
};

export default DashboardPage;