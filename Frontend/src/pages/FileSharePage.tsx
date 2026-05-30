// src/pages/FileSharePage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowDownTrayIcon,
  LinkIcon,
  ShieldCheckIcon,
  CalendarIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { FileIcon } from '../components/common/FileIcon';
import { getPublicFileInfoApi, getFileDownloadUrl, getFileViewUrl } from '../api/fileApi';
import { formatFileSize, formatDate, copyToClipboard } from '../lib/utils';
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
        const fileInfo = await getPublicFileInfoApi(uuid);
        setFile(fileInfo);
      } catch {
        setError('File not found or link has expired');
      } finally {
        setIsLoading(false);
      }
    };

    loadFile();
  }, [uuid]);

  const handleDownload = () => {
    if (file) {
      window.open(getFileDownloadUrl(file.uuid), '_blank');
    }
  };

  const handleCopyLink = async () => {
    const link = window.location.href;
    await copyToClipboard(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md text-center backdrop-blur-xl bg-white/5 border-white/10">
          <div className="py-8">
            <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <FileIcon mimetype="application/octet-stream" size="xl" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">File Not Found</h2>
            <p className="text-slate-400 mb-6">{error || 'This link may have expired'}</p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Go to Homepage
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const isImage = file.mimetype.startsWith('image/');

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <Card className="backdrop-blur-xl bg-white/5 border-white/10 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col items-center text-center mb-8">
              <FileIcon mimetype={file.mimetype} size="xl" />

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-6 break-all">
                {file.originalName}
              </h1>

              <p className="text-slate-400 mt-2">
                {formatFileSize(file.size)} &middot;{' '}
                {file.mimetype.split('/')[1]?.toUpperCase() || file.mimetype}
              </p>
            </div>

            {isImage && (
              <div className="mb-8 rounded-xl overflow-hidden bg-slate-800/50">
                <img
                  src={getFileViewUrl(file.uuid)}
                  alt={file.originalName}
                  className="w-full h-auto max-h-100] object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <CalendarIcon className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Uploaded</p>
                  <p className="text-sm text-white">{formatDate(file.uploadedAt, 'long')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <CubeIcon className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Size</p>
                  <p className="text-sm text-white">{formatFileSize(file.size)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleDownload}
                leftIcon={<ArrowDownTrayIcon className="w-5 h-5" />}
              >
                Download File
              </Button>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleCopyLink}
                leftIcon={<LinkIcon className="w-5 h-5" />}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Copy Link
              </Button>
            </div>
          </div>

          <div className="border-t border-white/10 px-6 py-4 bg-white/5 flex items-center justify-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-green-500" />
            <p className="text-xs text-slate-400">
              Secured with end-to-end encryption &middot; File expires according to server policy
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Powered by FileShare &middot; Secure file sharing for everyone
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileSharePage;