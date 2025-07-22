// server.js
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const multer   = require('multer');
const path     = require('path');
require('dotenv').config();

// Express app tanımı
const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads klasörü (görsel dosyalar için)
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// Rotalar
const authRoutes         = require('./routes/authRoutes');
const protectedRoutes    = require('./routes/protectedRoutes');
const roomRoutes         = require('./routes/roomRoutes');
const reservationRoutes  = require('./routes/reservationRoutes');
const customerRoutes     = require('./routes/customerRoutes');

// Route kullanım
app.use('/api/auth', authRoutes);                // Giriş & Kayıt işlemleri
app.use('/api/rooms', roomRoutes);               // Odalar
app.use('/api/reservations', reservationRoutes); // Rezervasyonlar
app.use('/api/customers', customerRoutes);       // Müşteri yönetimi
app.use('/api', protectedRoutes);                // Korumalı test rotası

// Ana test endpoint (opsiyonel)
app.get('/', (_req, res) => res.send('Hotel Management API çalışıyor 🚀'));

// .env'den değerleri al
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB bağlantısı
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB bağlantısı başarılı');
    app.listen(PORT, () =>
      console.log(`✅ Server http://localhost:${PORT} üzerinde çalışıyor`)
    );
  })
  .catch(err => {
    console.error('❌ MongoDB bağlantı hatası:', err);
    process.exit(1);
  });
