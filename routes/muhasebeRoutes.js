const express = require('express');
const router = express.Router();
const Muhasebe = require('../models/Muhasebe');

// Kayıt ekle
router.post('/add', async (req, res) => {
  try {
    const yeni = new Muhasebe(req.body);
    await yeni.save();
    res.json({ success: true, message: 'Muhasebe kaydı oluşturuldu' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listele
router.get('/all', async (req, res) => {
  const { userId } = req.query;
  const data = await Muhasebe.find({ userId });
  res.json(data);
});

module.exports = router;
