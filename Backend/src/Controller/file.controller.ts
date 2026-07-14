import type { Response, Request, NextFunction } from 'express';
import { ValidationError } from '../Utils/errors/httpErrors.js';
import { config } from '../Config/config.js';
import {
  singleFileUploadService,
  multipleFileUploadService,
  type FileUploadResponse,
} from '../Services/fileUpload.service.js';
import {
  getFileInfoService,
  getMultipleFilesInfoService,
  getPaginatedFilesService,
  type PaginationOptions,
} from '../Services/getFileInfo.service.js';
import { NotFoundError } from '../Utils/errors/httpErrors.js';
import { OkResponse } from '../Utils/success/httpSuccess.js';
import fs from 'fs';
import path from 'path';
import { File } from '../Models/file.schema.js';
import { deleteFileService } from '../Services/deleteFile.service.js';


export const fileUpload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new ValidationError(
        {},
        'Please select at least one file to upload.',
      );
    }
    const userID = req.user?._id; 
    let uploadResult: FileUploadResponse | FileUploadResponse[];

    if (files.length === 1) {
      uploadResult = await singleFileUploadService(files[0], userID);
    } else {
      uploadResult = await multipleFileUploadService(files, userID);
    }

    const formatResponse = (file: FileUploadResponse) => {
      return {
        fileName: file.fileName,
        originalName: file.originalName,
        size: file.size,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        mimetype: file.mimetype,
        uuid: file.uuid,
        fileShareUrl: `${config.APP_URL}${file.fileShareUrl}`,
        downloadUrl: `${config.APP_URL}/api/v1/files/download/${file.uuid}`,
        uploadedBy: file.uploadedBy,
      };
    };

    const responseData = Array.isArray(uploadResult)
      ? uploadResult.map(formatResponse)
      : formatResponse(uploadResult);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

export const getFileInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let { uuid } = req.params;

    if (!uuid) {
      throw new NotFoundError({}, 'File identifier is required.');
    }

    if (uuid.includes(',')) {
      const uuidArray = (Array.isArray(uuid) ? uuid[0] : uuid)
        .split(',')
        .map((id) => id.trim());
      const filesInfo = await getMultipleFilesInfoService(uuidArray);

      return res
        .status(200)
        .json(
          new OkResponse(
            { files: filesInfo },
            `Found ${filesInfo.length} file(s)`,
          ),
        );
    }

    const fileInfo = await getFileInfoService(
      Array.isArray(uuid) ? uuid[0] : uuid,
    );

    res
      .status(200)
      .json(
        new OkResponse(fileInfo, 'File information retrieved successfully'),
      );
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let { uuid } = req.params;

    if (!uuid || Array.isArray(uuid)) {
      throw new NotFoundError({}, 'Invalid file identifier.');
    }

    const file = await getFileInfoService(uuid);
    const uploadDir = path.resolve(process.cwd(), 'src', 'tmp', 'my-uploads');
    const filePath = path.join(uploadDir, file.fileName);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundError(
        {},
        'File not found on server. It may have been deleted.',
      );
    }
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.originalName)}"`,
    );

    res.setHeader('Content-Type', file.mimetype || 'application/octet-stream');
    res.setHeader('Content-Length', file.size);
    res.download(filePath, file.originalName, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
    });
  } catch (error) {
    next(error);
  }
};

export const viewFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let { uuid } = req.params;

    if (!uuid || Array.isArray(uuid)) {
      throw new NotFoundError({}, 'Invalid file identifier.');
    }

    const file = await getFileInfoService(uuid);
    const uploadDir = path.resolve(process.cwd(), 'src', 'tmp', 'my-uploads');
    const filePath = path.join(uploadDir, file.fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundError({}, 'File not found on server.');
    }
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(file.originalName)}"`,
    );
    res.setHeader('Content-Type', file.mimetype || 'application/octet-stream');
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

export const getMyFiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userID = req.user!._id;
    const options: PaginationOptions = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: (req.query.sortBy as string) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      search: req.query.search as string,
      userId: userID,
    };
    const result = await getPaginatedFilesService(options);
    const files = await File.find({ whoUploaded: userID })
      .sort({ createdAt: -1 })
      .lean();
    const formattedFiles = files.map((file) => ({
      fileName: file.fileName,
      originalName: file.originalName || file.fileName,
      size: file.size,
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      mimetype: file.mimetype,
      uuid: file.uuid,
      fileShareUrl: `${config.APP_URL}${file.fileShareUrl}`,
      downloadUrl: `${config.APP_URL}/api/v1/files/download/${file.uuid}`,
      uploadedBy: file.createdAt,
    }));
    res.status(200).json(
      new OkResponse(
        {
          files: formattedFiles,
          total: formattedFiles.length,
        },
        'Your files retrieved successfully',
      ),
    );
  } catch (error) {}
};

export const getAllFiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const options: PaginationOptions = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: (req.query.sortBy as string) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      search: req.query.search as string,
    };
    const result = await getPaginatedFilesService(options);
    res
      .status(200)
      .json(new OkResponse(result, 'Files retrieved Successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (
  req: Request,
  res :Response,
  next : NextFunction
) => {
  try {
    const {uuid} = req.params;
    const userId = req.user?._id; 
    if(!uuid){
      throw new ValidationError({}, "File UUID is required");
    }
    const result = await deleteFileService(uuid as string, userId);
    res.status(200).json(new OkResponse(result, "File Delete Successfully"));
  } catch (error) {
    next (error)
  }
}
