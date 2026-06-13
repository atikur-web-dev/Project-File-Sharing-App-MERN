// src/components/files/FileUpload.tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '../../lib/utils';
import { Button } from '../common/Button';
import { MaterialIcon } from '../common/MaterialIcon';
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
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const FileUpload = ({ onUploadSuccess, onUploadError }: FileUploadProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: { file: File }[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const sizeRejected = rejectedFiles.filter(
          (r) => r.file.size > FILE_CONFIG.MAX_FILE_SIZE
        );
        setError(
          sizeRejected.length > 0
            ? `File size exceeds ${FILE_CONFIG.MAX_FILE_SIZE_MB}MB limit`
            : 'Invalid file type or too many files'
        );
        return;
      }

      if (acceptedFiles.length + files.length > FILE_CONFIG.MAX_FILES_PER_UPLOAD) {
        setError(`Maximum ${FILE_CONFIG.MAX_FILES_PER_UPLOAD} files allowed per upload`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
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
      if (newFiles[index].preview) URL.revokeObjectURL(newFiles[index].preview!);
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
      const uploadError = err instanceof Error ? err : new Error('Upload failed');
      setError(uploadError.message);
      setIsUploading(false);
      setUploadProgress(0);
      onUploadError?.(uploadError);
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
    <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
      <div className="space-y-lg lg:col-span-8">
        <div
          {...getRootProps()}
          className={cn(
            'group relative flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest p-xl transition-all hover:border-secondary',
            isDragActive && 'border-secondary bg-secondary-container/10'
          )}
        >
          <input {...getInputProps()} />
          <div className="mb-lg flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high transition-transform group-hover:scale-110">
            <MaterialIcon name="upload_file" size={40} className="text-on-surface-variant" />
          </div>
          <p className="mb-xs text-center text-body-lg font-semibold text-primary">
            {isDragActive ? 'Drop files here' : 'Drag files here to upload or click to browse.'}
          </p>
          <p className="text-center text-body-sm text-on-surface-variant">
            Maximum {FILE_CONFIG.MAX_FILE_SIZE_MB}MB per file. Up to {FILE_CONFIG.MAX_FILES_PER_UPLOAD} files.
          </p>
        </div>

        {files.length > 0 && (
          <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-md py-sm">
              <h3 className="font-mono text-label-md uppercase tracking-wider text-on-surface-variant">
                Current Uploads
              </h3>
              <span className="rounded-full bg-secondary-container px-sm text-label-sm text-on-secondary-container">
                {files.length} file{files.length > 1 ? 's' : ''} ready
              </span>
            </div>
            <div className="divide-y divide-outline-variant">
              {files.map((file, index) => (
                <div key={index} className="group p-md transition-colors hover:bg-surface-container-low">
                  <div className="mb-sm flex items-center justify-between">
                    <div className="flex min-w-0 flex-1 items-center gap-md">
                      {file.preview ? (
                        <img src={file.preview} alt={file.name} className="h-10 w-10 shrink-0 rounded object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface-container-high">
                          <FileIcon mimetype={file.type} size="sm" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-body-md font-medium">{file.name}</p>
                        <p className="font-mono text-label-sm text-on-surface-variant">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-label-md text-on-tertiary-container hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  {isUploading && (
                    <div className="h-1 overflow-hidden rounded-full bg-surface-container-highest">
                      <div className="h-full bg-secondary transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {error && <p className="p-md text-center text-body-sm text-error">{error}</p>}
            {!isUploading && (
              <div className="flex gap-sm border-t border-outline-variant p-md">
                <Button variant="outline" onClick={clearAll}>Clear all</Button>
                <Button variant="primary" fullWidth onClick={handleUpload}>
                  Confirm &amp; Upload
                </Button>
              </div>
            )}
          </section>
        )}
      </div>

      <div className="lg:col-span-4">
        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
          <h3 className="mb-lg text-headline-md text-primary">Upload Tips</h3>
          <ul className="space-y-md text-body-sm text-on-surface-variant">
            <li className="flex gap-sm">
              <MaterialIcon name="check_circle" size={18} className="shrink-0 text-secondary" />
              Supported: images, PDF, documents, text files
            </li>
            <li className="flex gap-sm">
              <MaterialIcon name="lock" size={18} className="shrink-0 text-secondary" />
              Files are stored securely on our servers
            </li>
            <li className="flex gap-sm">
              <MaterialIcon name="link" size={18} className="shrink-0 text-secondary" />
              Share links are generated automatically after upload
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};
