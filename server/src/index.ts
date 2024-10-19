import express from 'express';
import connectDB from './db/connectDB.ts';
import { ServerConfig } from './config/index.ts';
import  apiRoutes from './routes/index.ts';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();



app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());


app.use('/api', apiRoutes);


app.listen(ServerConfig.PORT, () => {
  // Connect to MongoDB
connectDB();
  console.log(`Server is running on port ${ServerConfig.PORT}`);
});