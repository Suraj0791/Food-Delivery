import express from 'express';
import connectDB from './db/connectDB.ts';
import { ServerConfig } from './config/index.ts';
import  apiRoutes from './routes/index.ts';

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);


app.listen(ServerConfig.PORT, () => {
  console.log(`Server is running on port ${ServerConfig.PORT}`);
});