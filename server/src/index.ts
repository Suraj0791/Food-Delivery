import express from 'express';
import connectDB from './db/connectDB.ts';
import { ServerConfig } from './config/index.ts';

const app = express();
const port = ServerConfig.PORT || 3000;

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});