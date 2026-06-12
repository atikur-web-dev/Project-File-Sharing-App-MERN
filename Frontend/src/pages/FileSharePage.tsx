// src/pages/FileSharePage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { getPublicFileInfoApi, getFileDownloadUrl, getFileViewUrl } from '../api/fileApi';
import { formatFileSize, formatDate, copyToClipboard } from '../lib/utils';
import { showToast } from '../components/common/Toast';
import { ROUTES } from '../lib/constants';
import type { FileType } from '../types';

const FileSharePage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<FileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uuid) {
      setError('Invalid file link');
      setIsLoading(false);
      return;
    }
    const loadFile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        setFile(await getPublicFileInfoApi(uuid));
      } catch {
        setError('File not found or link has expired');
      } finally {
        setIsLoading(false);
      }
    };
    loadFile();
  }, [uuid]);

  const handleDownload = () => {
    if (file) window.open(getFileDownloadUrl(file.uuid), '_blank');
  };

  const handleCopyLink = async () => {
    await copyToClipboard(window.location.href);
    showToast.success('Link copied');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="max-w-md rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-center">
          <MaterialIcon name="error" size={48} className="mx-auto mb-md text-error" />
          <h2 className="mb-2 text-headline-md text-primary">File Not Found</h2>
          <p className="mb-6 text-body-sm text-on-surface-variant">{error || 'This link may have expired'}</p>
          <Button variant="primary" onClick={() => navigate(ROUTES.HOME)}>Go to Homepage</Button>
        </div>
      </div>
    );
  }

  const isImage = file.mimetype.startsWith('image/');
  const ext = file.mimetype.split('/')[1]?.toUpperCase() || 'FILE';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex h-16 items-center border-b border-outline-variant bg-surface px-xl">
        <nav className="flex items-center gap-sm text-body-sm text-on-surface-variant">
          <button type="button" onClick={() => navigate(ROUTES.HOME)} className="hover:text-primary">DevShare</button>
          <MaterialIcon name="chevron_right" size={16} />
          <span className="font-medium text-on-surface truncate max-w-xs">{file.originalName}</span>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl p-xl">
        <div className="grid grid-cols-12 items-start gap-lg">
          <div className="col-span-12 flex flex-col gap-lg lg:col-span-8">
            <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
              <div className="flex flex-wrap items-center justify-between gap-md border-b border-outline-variant bg-surface-container-low p-lg">
                <div className="flex items-center gap-md min-w-0">
                  <MaterialIcon name="description" size={32} className="shrink-0 text-secondary" />
                  <div className="min-w-0">
                    <h1 className="truncate text-headline-md text-primary">{file.originalName}</h1>
                    <p className="font-mono text-label-md uppercase text-on-surface-variant">{ext} • Shared File</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-sm">
                  <Button variant="primary" onClick={handleDownload} leftIcon={<MaterialIcon name="download" size={20} />}>
                    Download
                  </Button>
                  <Button variant="outline" onClick={handleCopyLink} leftIcon={<MaterialIcon name="link" size={20} />}>
                    Share Link
                  </Button>
                </div>
              </div>
              <div className="relative flex aspect-16/10 items-center justify-center bg-surface-container-high p-xl">
                {isImage ? (
                  <img src={getFileViewUrl(file.uuid)} alt={file.originalName} className="max-h-full max-w-full rounded-lg border border-outline-variant object-contain shadow-lg" />
                ) : (
                  <MaterialIcon name="description" size={80} className="text-on-surface-variant/30" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-md md:grid-cols-4">
              {[
                { label: 'File Size', value: formatFileSize(file.size) },
                { label: 'Format', value: ext },
                { label: 'Uploaded', value: formatDate(file.uploadedAt, 'short') },
                { label: 'Downloads', value: String(file.downloadCount ?? 0) },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-outline-variant p-md">
                  <p className="mb-xs font-mono text-label-sm uppercase text-on-surface-variant">{item.label}</p>
                  <p className="text-headline-md">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-lg">
              <div className="mb-md flex items-center gap-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container/20 text-secondary">
                  <MaterialIcon name="verified_user" size={24} filled />
                </div>
                <div>
                  <p className="text-body-md font-bold">Secure Storage</p>
                  <p className="font-mono text-label-sm text-on-surface-variant">Encrypted transfer</p>
                </div>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                This file is shared via a secure link. Download before the link expires per server policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSharePage;
