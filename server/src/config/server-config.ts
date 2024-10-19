import dotenv from 'dotenv';

dotenv.config();

export const ServerConfig = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
    CLOUD_NAME: process.env.CLOUD_NAME,
    MAILTRAP_API_TOKEN: process.env.MAILTRAP_API_TOKEN,
};