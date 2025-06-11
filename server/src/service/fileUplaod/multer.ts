import multer from 'multer';
import { Request, RequestHandler } from 'express';

// Set up memory storage (file stored in RAM, not saved to disk)
const storage = multer.memoryStorage();

// Function to check if the uploaded file is an image
function checkImageFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const filetypes = /jpg|jpeg|png|gif|bmp|tiff|webp/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = file.mimetype.startsWith('image/');

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
}

// Multer setup using memory storage, filtering only image types
const upload: RequestHandler = multer({
  storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    
    checkImageFileType(file, cb);
  },
}).single('image'); // Replace 'image' with the name of your form field if different

export default upload;
