// 📁 routes/roomRoutes.js

const express = require('express');
const router = express.Router();
const Room = require('../models/room'); // ✅ Dosya adı küçük harfle
const authenticate = require('../middleware/authMiddleware');

// ➕ Oda oluştur
router.post('/', authenticate, async (req, res) => {
  try {
    const room = await Room.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(room);
  } catch (err) {
    console.error('🚨 Oda oluşturma hatası:', err.message);
    res.status(400).json({ error: 'Oda oluşturulamadı' });
  }
});

// 📄 Tüm odaları getir (sadece kendi odaları)
router.get('/', authenticate, async (req, res) => {
  try {
    const rooms = await Room.find({ userId: req.user.id }).lean();
    res.status(200).json(rooms);
  } catch (err) {
    console.error('🚨 Oda listeleme hatası:', err.message);
    res.status(500).json({ error: 'Odalar alınamadı' });
  }
});

// 🔍 Tek oda getir
router.get('/:id', authenticate, async (req, res) => {
  try {
    const room = await Room.findOne({ _id: req.params.id, userId: req.user.id });
    if (!room) return res.status(404).json({ error: 'Oda bulunamadı' });
    res.status(200).json(room);
  } catch (err) {
    console.error('🚨 Oda getirme hatası:', err.message);
    res.status(400).json({ error: 'Oda bilgisi alınamadı' });
  }
});

// ✏️ Oda güncelle
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRoom) return res.status(404).json({ error: 'Oda bulunamadı' });
    res.status(200).json(updatedRoom);
  } catch (err) {
    console.error('🚨 Oda güncelleme hatası:', err.message);
    res.status(400).json({ error: 'Oda güncellenemedi' });
  }
});

// 🗑️ Oda sil
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deletedRoom = await Room.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedRoom) return res.status(404).json({ error: 'Oda bulunamadı' });
    res.status(200).json({ message: '✅ Oda silindi' });
  } catch (err) {
    console.error('🚨 Oda silme hatası:', err.message);
    res.status(400).json({ error: 'Oda silinemedi' });
  }
});

// 🚫 Tüm satışları kapat / aç
router.patch('/:id/closed', authenticate, async (req, res) => {
  const { closedAll } = req.body;

  if (typeof closedAll !== 'boolean') {
    return res.status(400).json({ error: 'closedAll alanı true/false olmalıdır' });
  }

  try {
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { closedAll },
      { new: true }
    );
    if (!updatedRoom) return res.status(404).json({ error: 'Oda bulunamadı' });
    res.status(200).json(updatedRoom);
  } catch (err) {
    console.error('🚨 Oda satış durumu hatası:', err.message);
    res.status(400).json({ error: 'Satış durumu değiştirilemedi' });
  }
});

// 📆 Belirli tarih aralığını kapat
router.post('/:id/closed-period', authenticate, async (req, res) => {
  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).json({ error: 'start ve end tarihleri zorunludur' });
  }

  try {
    const room = await Room.findOne({ _id: req.params.id, userId: req.user.id });
    if (!room) return res.status(404).json({ error: 'Oda bulunamadı' });

    room.closedPeriods.push({
      start: new Date(start),
      end: new Date(end)
    });

    await room.save();
    res.status(200).json(room);
  } catch (err) {
    console.error('🚨 Tarih kapama hatası:', err.message);
    res.status(400).json({ error: 'Tarih aralığı kaydedilemedi' });
  }
});

module.exports = router;
