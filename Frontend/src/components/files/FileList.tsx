// src/components/files/FileList.tsx
import { DocumentIcon } from '@heroicons/react/24/outline';
import { FileCard } from './FileCard';
import { Card } from '../common/Card';
import type { FileType } from '../../types';

interface FileListProps {
  files: FileType[];
  isLoading: boolean;
  onDelete: (uuid: string) => void;
}

export const FileList = ({ files, isLoading, onDelete }: FileListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-48 animate-pulse">
            <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </Card>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <Card className="text-center py-12">
        <DocumentIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No files yet
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload your first file to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map((file) => (
        <FileCard key={file.uuid} file={file} onDelete={onDelete} />
      ))}
    </div>
  );
};