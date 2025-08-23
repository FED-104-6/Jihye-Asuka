import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // JWT 토큰 생성/검증
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

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, admin: user.admin },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// register
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password, birthdate, type } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      birthdate,
      type: type || ['buyer'],
      admin: false,
      flats: [],
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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

router.patch('/:id/favorites', async (req, res) => {
  try {
    const userId = req.params.id;
    const { favorites } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { favorites },
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

router.patch('/:id/edit-profile', async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
