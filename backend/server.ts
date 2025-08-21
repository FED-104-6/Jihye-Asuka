import { createServer } from 'http';
import { connectDB } from './db/connect';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); // ✅ 프론트엔드 요청 허용
app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection('user').find().toArray(); // 컬렉션 이름
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/flats', async (req, res) => {
  try {
    const db = await connectDB();
    const flats = await db.collection('flat').find().toArray(); // 컬렉션 이름
    res.json(flats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
