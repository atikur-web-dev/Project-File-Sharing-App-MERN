// src/components/files/FileCard.tsx
import { useState } from 'react';
import { ConfirmModal } from '../common/Modal';
import { MaterialIcon } from '../common/MaterialIcon';
import { formatFileSize, formatRelativetime, copyToClipboard } from '../../lib/utils';
import { getFileDownloadUrl, getFileViewUrl } from '../../api/fileApi';
import { showToast } from '../common/Toast';
import type { FileType } from '../../types';

interface FileCardProps {
  file: FileType;
  onDelete: (uuid: string) => void;
}

const getExtension = (mimetype: string, name: string): string => {
  const fromName = name.split('.').pop()?.toUpperCase();
  if (fromName && fromName.length <= 5) return fromName;
  return mimetype.split('/')[1]?.toUpperCase() || 'FILE';
};

const getIconName = (mimetype: string): string => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.includes('pdf')) return 'picture_as_pdf';
  if (mimetype.includes('zip')) return 'folder_zip';
  if (mimetype.includes('csv') || mimetype.includes('sheet')) return 'table_chart';
  if (mimetype.includes('javascript') || mimetype.includes('typescript')) return 'code';
  if (mimetype.includes('css')) return 'css';
  return 'description';
};

export const FileCard = ({ file, onDelete }: FileCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const ext = getExtension(file.mimetype, file.originalName);
  const iconName = getIconName(file.mimetype);
  const isImage = file.mimetype.startsWith('image/');

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/share/${file.uuid}`;
    await copyToClipboard(shareUrl);
    showToast.success('Share link copied');
  };

  const handleDownload = () => {
    window.open(getFileDownloadUrl(file.uuid), '_blank');
  };

  const handlePreview = () => {
    window.open(getFileViewUrl(file.uuid), '_blank');
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      onDelete(file.uuid);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="file-card group relative cursor-pointer rounded-xl border border-outline-variant bg-white p-md transition-all hover:border-primary/40 hover:shadow-sm">
        <div className="mb-md flex items-start justify-between">
          {isImage ? (
            <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-low">
              <img
                src={getFileViewUrl(file.uuid)}
                alt={file.originalName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-low text-primary">
              <MaterialIcon name={iconName} size={28} />
            </div>
          )}
          <div className="absolute top-md right-md opacity-0 transition-all group-hover:opacity-100">
            <div className="flex gap-0.5 rounded bg-white/90 p-0.5 shadow-sm backdrop-blur">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleCopyLink(); }}
                className="rounded p-1 hover:bg-surface-container-high"
                title="Copy link"
              >
                <MaterialIcon name="link" size={16} className="text-on-surface-variant" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handlePreview(); }}
                className="rounded p-1 hover:bg-surface-container-high"
                title="Preview"
              >
                <MaterialIcon name="visibility" size={16} className="text-on-surface-variant" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                className="rounded p-1 hover:bg-surface-container-high"
                title="Download"
              >
                <MaterialIcon name="download" size={16} className="text-on-surface-variant" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
                className="rounded p-1 hover:bg-error-container/30"
                title="Delete"
              >
                <MaterialIcon name="delete" size={16} className="text-error" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-xs truncate text-body-md font-bold text-on-surface" title={file.originalName}>
            {file.originalName}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-mono text-label-sm text-on-surface-variant">
              {formatFileSize(file.size)} • {formatRelativetime(file.uploadedAt)}
            </span>
            <span className="rounded bg-surface-container-highest px-1.5 py-0.5 text-[9px] font-bold text-on-surface-variant">
              {ext}
            </span>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete File"
        message={`Are you sure you want to delete "${file.originalName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};
