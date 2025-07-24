// 📁 server.js
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const multer   = require('multer');
const path     = require('path');
require('dotenv').config();

const app = express();

// ✅ CORS – Sadece izinli domain'lere açık
const allowedOrigins = [
  'https://tatillenofficial.com',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS hatası: Yetkisiz origin.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// 📦 JSON & Form Verisi
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Yükleme klasörü – Görsel erişimi
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// 📌 Route'lar
const authRoutes         = require('./routes/authRoutes');
const protectedRoutes    = require('./routes/protectedRoutes');
const roomRoutes         = require('./routes/roomRoutes');
const reservationRoutes  = require('./routes/reservationRoutes');
const customerRoutes     = require('./routes/customerRoutes');

// 🔗 Route Kullanımı
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api', protectedRoutes);

// ✅ Ana endpoint – Test
app.get('/', (_req, res) => {
  res.send('🚀 Hotel Management API aktif – Tatillen için hazır');
});

// 🌍 Ortam Değişkenleri
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// 🔌 MongoDB Bağlantısı
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
