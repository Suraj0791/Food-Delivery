import { v2 as cloudinary } from 'cloudinary';
import { ServerConfig } from '../config/index.ts';

cloudinary.config({
    api_key: ServerConfig.CLOUDINARY_API_KEY,
    api_secret: ServerConfig.CLOUDINARY_API_SECRET,
    cloud_name: ServerConfig.CLOUDINARY_CLOUD_NAME,
});

export default cloudinary;