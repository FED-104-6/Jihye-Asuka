import { Router } from 'express';
import { User } from '../models/user.model';

const router = Router();

// find all
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('flats'); // flats까지 가져오기
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// register
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted', user: deletedUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// change admin
router.patch('/:id/admin', async (req, res) => {
  try {
    const userId = req.params.id;
    const { admin } = req.body; // boolean expected
    if (typeof admin !== 'boolean') {
      return res.status(400).json({ error: 'Invalid admin value' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { admin },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Admin status updated', user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
