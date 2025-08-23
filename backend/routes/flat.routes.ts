import { Router } from 'express';
import { Flat } from '../models/flat.model';
import { User } from '../models/user.model';

const router = Router();

// req, res 있는 게 '라우팅'
// find all
router.get('/', async (req, res) => {
  try {
    const flats = await Flat.find().populate('owner');
    res.json(flats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// find one flat
router.get('/:id', async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id).populate('owner');
    if (!flat) return res.status(404).json({ error: 'Flat not found' });
    res.json(flat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// find all by userId
router.get('/owner/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const flats = await Flat.find({ owner: userId });
    res.json(flats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// add flat
router.post('/create/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const flatData = req.body;

    // flat 생성
    const flat = new Flat({ ...flatData, owner: userId });
    await flat.save();

    // user에도 flat 추가
    await User.findByIdAndUpdate(userId, { $push: { flats: flat._id } });

    res.json(flat);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// change flat
router.patch('/edit/:id', async (req, res) => {
  try {
    const flatId = req.params.id;
    const updates = { ...req.body };

    const updatedFlat = await Flat.findByIdAndUpdate(
      flatId,
      { $set: updates },
      { new: true }
    );

    if (!updatedFlat) {
      return res.status(404).json({ error: 'Flat not found' });
    }

    res.json({ message: 'Flat updated successfully', flat: updatedFlat });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const flatId = req.params.id;
    const deleteFlat = await Flat.findByIdAndDelete(flatId);
    if (!deleteFlat) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted', user: deleteFlat });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
