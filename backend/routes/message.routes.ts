import { Router } from 'express';
import { Message } from '../models/message.model';

const router = Router();

// get inbox
router.get('/inbox/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const inbox = await Message.find({ recipient: userId })
      .populate('sender')
      .populate('recipient')
      .populate('flat')
      .sort({ createdAt: -1 });
    res.status(200).json(inbox);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get outbox
router.get('/outbox/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const outbox = await Message.find({ sender: userId })
      .populate('sender')
      .populate('recipient')
      .populate('flat')
      .sort({
        createdAt: -1,
      });
    res.status(200).json(outbox);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

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
