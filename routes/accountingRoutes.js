const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const AccountingEntry = require('../models/AccountingEntry');

// ✅ GET – Kullanıcının tüm muhasebe verileri
router.get('/', authenticate, async (req, res) => {
  try {
    const entries = await AccountingEntry.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ✅ POST – Yeni kayıt ekle
router.post('/', authenticate, async (req, res) => {
  try {
    const data = req.body;
    const entry = new AccountingEntry({ ...data, user: req.user.id });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: 'Kayıt eklenemedi.', detail: err.message });
  }
});

// ✅ DELETE – Kayıt sil
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await AccountingEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!result) return res.status(404).json({ error: 'Kayıt bulunamadı.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Silme işlemi başarısız.' });
  }
});

// ✅ PUT – Kayıt güncelle
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updated = await AccountingEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Kayıt bulunamadı.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Güncelleme hatası.' });
  }
});

module.exports = router;
