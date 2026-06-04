// src/components/common/FileIcon.tsx
import React from "react";
import {
  DocumentIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils";

interface FileIconProps {
  mimetype: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-20 h-20 sm:w-24 sm:h-24",
};

type FileType = "image" | "pdf" | "document" | "video" | "audio" | "archive" | "file";

const colorMap: Record<FileType, string> = {
  image: "text-green-500 dark:text-green-400",
  pdf: "text-red-500 dark:text-red-400",
  document: "text-blue-500 dark:text-blue-400",
  video: "text-purple-500 dark:text-purple-400",
  audio: "text-yellow-500 dark:text-yellow-400",
  archive: "text-orange-500 dark:text-orange-400",
  file: "text-gray-500 dark:text-gray-400",
};

const getFileType = (mimetype: string): FileType => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype === "application/pdf") return "pdf";
  if (mimetype.includes("word") || mimetype.includes("document")) return "document";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  if (mimetype.includes("zip") || mimetype.includes("compressed")) return "archive";
  return "file";
};

const iconMap: Record<FileType, React.ElementType> = {
  image: PhotoIcon,
  pdf: DocumentTextIcon,
  document: DocumentTextIcon,
  video: VideoCameraIcon,
  audio: MusicalNoteIcon,
  archive: ArchiveBoxIcon,
  file: DocumentIcon,
};

export const FileIcon: React.FC<FileIconProps> = ({
  mimetype,
  size = "md",
  className,
}) => {
  const fileType = getFileType(mimetype);

  const Icon = iconMap[fileType];

  return (
    <Icon
      className={cn(
        sizeMap[size],
        colorMap[fileType],
        className
      )}
    />
  );
};