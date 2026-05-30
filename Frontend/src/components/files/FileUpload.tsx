// src/components/files/FileUpload.tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  CloudArrowUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { FileIcon } from '../common/FileIcon';
import { uploadMultipleFilesApi } from '../../api/fileApi';
import { FILE_CONFIG } from '../../lib/constants';
import type { FileUploadResponse } from '../../types';

interface FileWithPreview extends File {
  preview?: string;
}

interface FileUploadProps {
  onUploadSuccess: (uploadedFiles: FileUploadResponse[]) => void;
  onUploadError?: (error: Error) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileUpload = ({ onUploadSuccess, onUploadError }: FileUploadProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const sizeRejected = rejectedFiles.filter(
          (r) => r.file.size > FILE_CONFIG.MAX_FILE_SIZE
        );
        if (sizeRejected.length > 0) {
          setError(`File size exceeds ${FILE_CONFIG.MAX_FILE_SIZE_MB}MB limit`);
        } else {
          setError('Invalid file type or too many files');
        }
        return;
      }

      if (acceptedFiles.length + files.length > FILE_CONFIG.MAX_FILES_PER_UPLOAD) {
        setError(`Maximum ${FILE_CONFIG.MAX_FILES_PER_UPLOAD} files allowed per upload`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
        })
      );

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: FILE_CONFIG.MAX_FILE_SIZE,
    maxFiles: FILE_CONFIG.MAX_FILES_PER_UPLOAD,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'audio/*': ['.mp3', '.wav'],
    },
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
    setError(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select files to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const uploadedFiles = await uploadMultipleFilesApi(files);

      clearInterval(progressInterval);
      setUploadProgress(100);

      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });

      setTimeout(() => {
        setFiles([]);
        setUploadProgress(0);
        setIsUploading(false);
        onUploadSuccess(uploadedFiles);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error.message);
      setIsUploading(false);
      setUploadProgress(0);
      onUploadError?.(error);
    }
  };

  const clearAll = () => {
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setError(null);
  };

  return (
    <Card className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 sm:p-10 transition-all duration-200 cursor-pointer',
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500',
          files.length > 0 && 'pb-4'
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center text-center">
          <CloudArrowUpIcon
            className={cn(
              'w-12 h-12 sm:w-14 sm:h-14 mb-3 transition-colors',
              isDragActive ? 'text-primary-500' : 'text-gray-400'
            )}
          />

          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
            {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            or <span className="text-primary-600 dark:text-primary-400">browse</span> from your device
          </p>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Up to {FILE_CONFIG.MAX_FILES_PER_UPLOAD} files, max {FILE_CONFIG.MAX_FILE_SIZE_MB}MB each
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selected Files ({files.length})
            </h4>
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-10 h-10 rounded object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <FileIcon mimetype={file.type} size="sm" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeFile(index)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ml-2 flex-shrink-0"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {!isUploading && (
            <Button variant="primary" fullWidth onClick={handleUpload}>
              Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};