import { Router } from 'express';
import { Message } from '../models/message.model';

const router = Router();

// send message
router.post('/', async (req, res) => {
  try {
    const newMsg = req.body;

    const msg = await Message.create(newMsg);

    res.status(201).json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;
