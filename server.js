// 📁 server.js
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const multer   = require('multer');
const path     = require('path');
require('dotenv').config();

// ✅ Telegram bot sistemi – otomatik başlatılır
require('./telegramBots');

const app = express();

// ✅ CORS – sadece izin verilen domain’ler erişebilir
const allowedOrigins = [
  'https://tatillenofficial.com',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS hatası: Yetkisiz domain.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// 📦 JSON & Form veri desteği
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Statik dosyalar (örneğin görsel yüklemeleri)
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// 📌 Route dosyaları
const authRoutes         = require('./routes/authRoutes');
const protectedRoutes    = require('./routes/protectedRoutes');
const roomRoutes         = require('./routes/roomRoutes');
const reservationRoutes  = require('./routes/reservationRoutes');
const customerRoutes     = require('./routes/customerRoutes');
const accountingRoutes   = require('./routes/accountingRoutes');
const companyRoutes      = require('./routes/companyRoutes');

// 📌 Route bağlantıları
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api', protectedRoutes); // JWT doğrulama isteyen route'lar
app.use('/api/company', companyRoutes); // Telegram ID işlemleri

// 🔍 Basit test endpoint’i
app.get('/', (_req, res) => {
  res.send('🚀 Hotel Management API aktif – Tatillen HMS için hazır.');
});

// 🌍 Ortam değişkenleri
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// 🔌 MongoDB bağlantısı
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB bağlantısı başarılı');
  app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB bağlantı hatası:', err.message);
  process.exit(1);
});
