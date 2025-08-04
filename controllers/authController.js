const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ KAYIT FONKSİYONU
const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Bu e-posta zaten kayıtlı!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role,
    });

    // 🟡 Önce kullanıcıyı kaydet
    const savedUser = await user.save();

    // 🔁 Kendi _id’sini companyId olarak ata
    savedUser.companyId = savedUser._id;
    await savedUser.save();

    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu!' });
  } catch (err) {
    res.status(500).json({ error: 'Kayıt sırasında bir hata oluştu' });
  }
};

// ✅ GİRİŞ FONKSİYONU (companyId dahil!)
const login = async (req, res) => {
  console.log("Gelen login isteği:", req.body); // 🐞 Log

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'E-posta bulunamadı' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Şifre yanlış' });
    }

    // ✅ Token’a companyId’yi de dahil et
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        companyId: user.companyId || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Giriş başarılı!',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        companyId: user.companyId || null,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

module.exports = { register, login };
