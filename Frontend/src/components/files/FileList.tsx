// src/components/files/FileList.tsx
import { MaterialIcon } from '../common/MaterialIcon';
import { FileCard } from './FileCard';
import type { FileType } from '../../types';

interface FileListProps {
  files: FileType[];
  isLoading: boolean;
  onDelete: (uuid: string) => void;
}

export const FileList = ({ files, isLoading, onDelete }: FileListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl border border-outline-variant bg-surface-container-low" />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest py-16 text-center">
        <MaterialIcon name="folder_open" size={64} className="mx-auto text-on-surface-variant/40" />
        <h3 className="mt-4 text-headline-md text-primary">No files yet</h3>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Upload your first file to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {files.map((file) => (
        <FileCard key={file.uuid} file={file} onDelete={onDelete} />
      ))}
    </div>
  );
};
