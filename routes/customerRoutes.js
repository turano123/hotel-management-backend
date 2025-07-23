// 📁 routes/customerRoutes.js

const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const authenticate = require('../middleware/authMiddleware'); // ✅ Token kontrolü

// ➕ Yeni müşteri ekle
router.post('/', authenticate, async (req, res) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      userId: req.user.id // 🔐 Kullanıcıya özel müşteri
    });
    res.status(201).json(customer);
  } catch (err) {
    console.error('Müşteri ekleme hatası:', err);
    res.status(400).json({ error: 'Müşteri eklenemedi. Lütfen bilgileri kontrol edin.' });
  }
});

// 📄 Müşteri listesi (sadece kendi müşterileri)
router.get('/', authenticate, async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error('Müşteri listeleme hatası:', err);
    res.status(500).json({ error: 'Müşteri listesi alınamadı.' });
  }
});

// 🔍 Tek müşteri getir
router.get('/:id', authenticate, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!customer) {
      return res.status(404).json({ error: 'Müşteri bulunamadı' });
    }

    res.json(customer);
  } catch (err) {
    console.error('Müşteri getirme hatası:', err);
    res.status(400).json({ error: 'Geçersiz müşteri ID' });
  }
});

// 🔄 Müşteri güncelle
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updated = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Müşteri bulunamadı' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Müşteri güncelleme hatası:', err);
    res.status(400).json({ error: 'Güncelleme başarısız' });
  }
});

// ❌ Müşteri sil
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Customer.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Müşteri bulunamadı' });
    }

    res.json({ message: '✅ Müşteri silindi' });
  } catch (err) {
    console.error('Müşteri silme hatası:', err);
    res.status(400).json({ error: 'Silme işlemi başarısız' });
  }
});

module.exports = router;
