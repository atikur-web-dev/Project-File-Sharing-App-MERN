import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = path.resolve(process.cwd(), "src", "tmp", "my-uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
  console.log(`Upload directory created: ${uploadDirectory}`);
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const newFileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    cb(null, newFileName);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

export const upload = multer({
  storage: storage,               
  limits: {
    fileSize: 5 * 1024 * 1024,    
  },
  fileFilter: fileFilter,        
});
