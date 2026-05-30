// src/components/common/FileIcon.tsx
import React from 'react';
import {
  DocumentIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

interface FileIconProps {
  mimetype: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-20 h-20 sm:w-24 sm:h-24',
};

const colorMap: Record<string, string> = {
  image: 'text-green-500',
  pdf: 'text-red-500',
  document: 'text-blue-500',
  video: 'text-purple-500',
  audio: 'text-yellow-500',
  archive: 'text-orange-500',
  file: 'text-gray-500',
};

export const FileIcon: React.FC<FileIconProps> = ({
  mimetype,
  size = 'md',
  className,
}) => {
  const getIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return PhotoIcon;
    if (mimetype === 'application/pdf') return DocumentTextIcon;
    if (mimetype.includes('word') || mimetype.includes('document')) return DocumentTextIcon;
    if (mimetype.startsWith('video/')) return VideoCameraIcon;
    if (mimetype.startsWith('audio/')) return MusicalNoteIcon;
    if (mimetype.includes('zip') || mimetype.includes('compressed')) return ArchiveBoxIcon;
    return DocumentIcon;
  };

  const getColor = (mimetype: string): string => {
    if (mimetype.startsWith('image/')) return colorMap.image;
    if (mimetype === 'application/pdf') return colorMap.pdf;
    if (mimetype.includes('word')) return colorMap.document;
    if (mimetype.startsWith('video/')) return colorMap.video;
    if (mimetype.startsWith('audio/')) return colorMap.audio;
    if (mimetype.includes('zip') || mimetype.includes('compressed')) return colorMap.archive;
    return colorMap.file;
  };

  const Icon = getIcon(mimetype);
  const color = getColor(mimetype);

  return <Icon className={cn(sizeMap[size], color, className)} />;
};