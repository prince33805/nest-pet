import { diskStorage } from 'multer';
import { join, extname } from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(__dirname, '..', '..', UPLOAD_DIR); // Save to project-root/uploads
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `pet-photo-${uniqueSuffix}${ext}`);
    },
  }),
};
