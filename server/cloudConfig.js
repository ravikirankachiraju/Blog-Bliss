import { v2 as cloudinary } from 'cloudinary'; // Importing Cloudinary v2
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config(); 
cloudinary.config({                           //CloudinaryStorage Configures Multer to use Cloudinary as the storage destination.
  cloud_name: process.env.CLOUD_NAME ,        
  api_key: process.env.CLOUD_API_KEY ,
  api_secret: process.env.CLOUD_API_SECRET} )

const storage = new CloudinaryStorage({
    cloudinary: cloudinary
 ,
    params: {
      folder: 'blogbliss_DEV',
      allowedFormats: ['png','jpeg','jpg'] ,
    },
  });

export default storage; 
