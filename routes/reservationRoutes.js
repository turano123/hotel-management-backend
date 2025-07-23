// 📁 routes/reservationRoutes.js

const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const authenticate = require('../middleware/authMiddleware'); // 🛡️ JWT doğrulama

// 📄 Tüm rezervasyonları getir (Sadece o kullanıcıya ait)
router.get('/', authenticate, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id }).sort({ checkIn: -1 });
    res.status(200).json(reservations);
  } catch (err) {
    console.error('🚨 Rezervasyon listeleme hatası:', err.message);
    res.status(500).json({ error: 'Rezervasyonlar alınamadı' });
  }
});

// ➕ Yeni rezervasyon oluştur
router.post('/', authenticate, async (req, res) => {
  try {
    const newReservation = new Reservation({
      ...req.body,
      userId: req.user.id
    });
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    console.error('🚨 Rezervasyon kayıt hatası:', err.message);
    res.status(500).json({ error: 'Rezervasyon kaydedilemedi' });
  }
});

// ✏️ Rezervasyon güncelle
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updated = await Reservation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Rezervasyon bulunamadı' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('🚨 Rezervasyon güncelleme hatası:', err.message);
    res.status(500).json({ error: 'Rezervasyon güncellenemedi' });
  }
});

// 🗑️ Rezervasyon sil
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Reservation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Rezervasyon bulunamadı' });
    }

    res.status(200).json({ message: '✅ Rezervasyon silindi' });
  } catch (err) {
    console.error('🚨 Rezervasyon silme hatası:', err.message);
    res.status(500).json({ error: 'Rezervasyon silinemedi' });
  }
});

module.exports = router;
