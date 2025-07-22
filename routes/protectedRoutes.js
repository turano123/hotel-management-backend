// 📁 hotel-management-backend/routes/protectedRoutes.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

// 🔐 Korunan örnek route
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'JWT doğrulaması başarılı 🎉',
    user: req.user
  });
});

module.exports = router;
