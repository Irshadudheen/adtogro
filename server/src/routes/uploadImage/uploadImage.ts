import { Router } from "express";
import upload from "../../service/fileUplaod/multer";
import { BadRequestError } from "../../errors/bad-request-error";
import cloudinary from "../../service/fileUplaod/cloudinary";
import streamifier from 'streamifier';
const router = Router();
router.post('/api/upload-image',upload, async (req,res)=>{
    console.log('upload image',req.file)
    const result:cloudinary.UploadApiResponse|undefined = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
       if (!req.file?.buffer) {
      throw new BadRequestError('Image file is required');
    }
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    if(!result){
        throw new BadRequestError('Image upload failed');
    }
    console.log(result,'cloudinary result')
    res.send(result.secure_url)
    
})
export { router as uploadImageRouter }