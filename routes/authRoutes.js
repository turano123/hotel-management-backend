// 📁 hotel-management-backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//----------------------------------------
// 📁 1. Upload klasörü ve multer ayarları
//----------------------------------------
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });

//----------------------------------------
// ✅ 2. POST /api/auth/register – Kayıt
//----------------------------------------
router.post(
  '/register',
  upload.fields([
    { name: 'vergiFile', maxCount: 1 },
    { name: 'turizmFile', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        identityNo,
        taxNo,
        taxOffice,
        companyName,
        authorizedPerson,
        address,
        password,
        tourismCert,
        tourismCertNo
      } = req.body;

      // ⚠️ Vergi levhası zorunlu
      if (!req.files?.vergiFile) {
        return res.status(400).json({ msg: 'Vergi levhası yüklenmesi zorunludur.' });
      }

      // ✅ E-posta kontrolü
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Bu e-posta zaten kayıtlı.' });
      }

      // 🔐 Şifreyi hashle
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // ✅ Yeni kullanıcı oluştur
      const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        identityNo,
        taxNo,
        taxOffice,
        companyName,
        authorizedPerson,
        address,
        password: hashedPassword,
        tourismCert,
        tourismCertNo: tourismCert === 'Var' ? tourismCertNo : '',
        vergiFile: req.files.vergiFile[0].filename,
        turizmFile:
          tourismCert === 'Var' && req.files?.turizmFile
            ? req.files.turizmFile[0].filename
            : ''
      });

      await newUser.save();

      return res.status(201).json({ msg: '✅ Kayıt başarılı!' });
    } catch (err) {
      console.error('❌ Kayıt Hatası:', err);
      return res.status(500).json({ msg: 'Sunucu hatası.' });
    }
  }
);

//----------------------------------------
// ✅ 3. POST /api/auth/login – Giriş
//----------------------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Kullanıcı bulunamadı' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Şifre hatalı' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'tatillen-secret', {
      expiresIn: '1d'
    });

    return res.json({
      token,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      userId: user._id
    });
  } catch (err) {
    console.error('❌ Login Hatası:', err);
    return res.status(500).json({ msg: 'Sunucu hatası' });
  }
});

module.exports = router;
