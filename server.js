// server.js
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const multer   = require('multer');
const path     = require('path');
require('dotenv').config();

// Express app oluştur
const app = express();

// ✅ Gelişmiş CORS ayarları
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://hotel-management-frontend-zmec.vercel.app',
    'https://tatillenofficial.com' // Gerekirse domainin eklenir
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight CORS fix

// 📦 Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Upload klasörü static servis
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// 📌 Routes
const authRoutes         = require('./routes/authRoutes');
const protectedRoutes    = require('./routes/protectedRoutes');
const roomRoutes         = require('./routes/roomRoutes');
const reservationRoutes  = require('./routes/reservationRoutes');
const customerRoutes     = require('./routes/customerRoutes');

// 🔗 Route kullanımı
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api', protectedRoutes);

// ✅ Test endpoint
app.get('/', (_req, res) => res.send('Hotel Management API çalışıyor 🚀'));

// 🔐 Ortam değişkenleri
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// 🔗 MongoDB bağlantısı
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB bağlantısı başarılı');
  app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} üzerinde çalışıyor`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB bağlantı hatası:', err.message);
  process.exit(1);
});
