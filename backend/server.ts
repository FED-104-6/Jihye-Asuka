import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes';
import flatRoutes from './routes/flat.routes';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// DB connect
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// register route
app.use('/users', userRoutes);
app.use('/flats', flatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
