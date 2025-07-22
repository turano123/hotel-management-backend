// routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../models/Room');
const authenticate = require('../middleware/authMiddleware'); // ✅ Dosya adı düzeltildi

// ➕ Oda oluştur
router.post('/', authenticate, async (req, res) => {
  try {
    const room = await Room.create({
      ...req.body,
      userId: req.user.id // ✅ o kullanıcıya ait odalar
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📄 Tüm odaları getir
router.get('/', authenticate, async (req, res) => {
  try {
    const rooms = await Room.find({ userId: req.user.id }).lean(); // ✅ filtreleme
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 Tek oda getir
router.get('/:id', authenticate, async (req, res) => {
  try {
    const room = await Room.findOne({ _id: req.params.id, userId: req.user.id });
    if (!room) return res.status(404).json({ error: 'Oda bulunamadı' });
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✏️ Oda güncelle
router.put('/:id', authenticate, async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!room) return res.status(404).json({ error: 'Oda bulunamadı' });
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🗑️ Oda sil
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const room = await Room.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!room) return res.status(404).json({ error: 'Oda bulunamadı' });
    res.json({ message: 'Oda silindi' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🚫 Satışı aç/kapat
router.patch('/:id/closed', authenticate, async (req, res) => {
  const { closedAll } = req.body;
  if (typeof closedAll !== 'boolean')
    return res.status(400).json({ error: 'closedAll boolean olmalı' });

  try {
    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { closedAll },
      { new: true }
    );
    if (!room) return res.status(404).json({ error: 'Oda bulunamadı' });
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📆 Belirli aralığı kapat
router.post('/:id/closed-period', authenticate, async (req, res) => {
  const { start, end } = req.body;
  if (!start || !end)
    return res.status(400).json({ error: 'start ve end zorunlu' });

  try {
    const room = await Room.findOne({ _id: req.params.id, userId: req.user.id });
    if (!room) return res.status(404).json({ error: 'Oda bulunamadı' });

    room.closedPeriods.push({
      start: new Date(start),
      end: new Date(end)
    });

    await room.save();
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
