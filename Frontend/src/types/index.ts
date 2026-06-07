// src/types/index.ts

export interface User {
  _id: string;                    
  displayName: string;            
  email: string;                  
  emailVerification: Date | null; 
  createdAt?: string;             
  updatedAt?: string;            
}

// File type => File Data will come following this format from DB
export interface FileType {
  fileName: string;       
  originalName: string;  
  size: number;           
  sizeInMB: string;       
  mimetype: string;       
  uuid: string;           
  fileShareUrl: string;   
  downloadUrl: string;    
  viewUrl?: string;       
  uploadedAt: string;     
  uploadedBy?: string;    
  downloadCount?: number; 
}

// File Upload Response Type => after uploading a file, Backend will send following this type
export interface FileUploadResponse {
  fileName: string;       
  originalName: string;  
  size: number;          
  sizeInMB: string;       
  mimetype: string;       
  uuid: string;           
  fileShareUrl: string;   
  downloadUrl: string;    
  uploadedBy?: string;    
}

export interface PaginationMeta {
  currentPage: number;  
  totalPages: number;  
  totalFiles: number;  
  limit: number;       
  hasNextPage: boolean; 
  hasPrevPage: boolean; 
}


export interface PaginatedFilesResponse {
  files: FileType[];        
  pagination: PaginationMeta;  
}


export interface ApiResponse<T = unknown> {
  statusCode: number; 
  success: boolean;   
  message: string;    
  data?: T;           
}

export interface ApiErrorResponse {
  success: false;                    
  message: string;                   
  errors?: Record<string, string[]>;  
  stack?: string;                      
}

export interface RegisterFormData {
  displayName: string;  
  email: string;        
  password: string;     
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  displayName: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DownloadStats {
  totalDownloads: number;
  filesByDownloads: {
    fileName: string;
    downloadCount: number;
    uuid: string;
  }[];
}

export interface FileQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "size" | "fileName";
  sortOrder?: "asc" | "desc";
}