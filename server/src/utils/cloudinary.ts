import { v2 as cloudinary } from 'cloudinary';
import { ServerConfig } from '../config/index.ts';

cloudinary.config({
    api_key: ServerConfig.API_KEY,
    api_secret: ServerConfig.API_SECRET,
    cloud_name: ServerConfig.CLOUD_NAME,
});

export default cloudinary;