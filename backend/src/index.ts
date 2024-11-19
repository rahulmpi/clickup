import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { connectDb } from './configs/db';
import { router as userRouter } from './routes/usersRoutes';
import { router as spaceRouter } from './routes/spaceRoutes';
import { router as folderRouter } from './routes/folderRoutes';
import { router as listRouter } from './routes/listRoutes';

dotenv.config()
connectDb();
const app = express();
app.use(express.json());
app.use(cors())
const PORT = process.env.PORT || 3001;

app.use([userRouter, spaceRouter, folderRouter, listRouter]);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 