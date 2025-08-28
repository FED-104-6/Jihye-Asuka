import { Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { Flat } from '../models/flat.model';
import { Message } from '../models/message.model';
import jwt from 'jsonwebtoken';

const router = Router();

// find all
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('flats');
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
// find user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('flats')
      .populate({
        path: 'favorites',
        populate: { path: 'owner' }, // 중첩 가능
      });
    if (!user) return res.status(404).json({ error: 'Flat not found' });
    res.json(user);
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
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
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
    const { firstname, lastname, email, password, birthdate, type, admin } =
      req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      birthdate,
      type: type || ['buyer'],
      admin,
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

    const deletedFlatIds = deletedUser.flats;

    const deletedFlats = await Flat.deleteMany({ owner: userId });
    const deletedMessages = await Message.deleteMany({ sender: userId });

    await User.updateMany(
      { favorites: { $in: deletedFlatIds } },
      { $pull: { favorites: { $in: deletedFlatIds } } }
    );

    res.json({
      message: 'User, their flats and related messages deleted',
      user: deletedUser,
      deletedFlatsCount: deletedFlats.deletedCount,
      deletedMessagesCount: deletedMessages.deletedCount,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// change user
router.patch('/:id/edit/all', async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = { ...req.body.user };

    if (!updates.password) {
      delete updates.password;
    } else {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// change admin
router.patch('/:id/edit/admin', async (req, res) => {
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

router.patch('/:id/edit/favorites', async (req, res) => {
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
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
