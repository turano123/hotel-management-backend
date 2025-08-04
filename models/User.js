// 📁 models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName:      { type: String, required: true },
  lastName:       { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  phone:          { type: String, required: true },
  identityNo:     { type: String, required: true },
  taxNo:          { type: String, required: true },
  taxOffice:      { type: String, required: true },
  companyName:    { type: String, required: true },
  authorizedPerson: { type: String, required: true },
  address:        { type: String, required: true },
  password:       { type: String, required: true },

  tourismCert:    { type: String, enum: ['Var', 'Yok'], default: 'Yok' },
  tourismCertNo:  { type: String, default: '' },

  vergiFile:      { type: String, required: true },
  turizmFile:     { type: String, default: '' },

  role:           { type: String, enum: ['admin', 'receptionist', 'customer'], default: 'customer' },

  isActive:       { type: Boolean, default: true },
  createdAt:      { type: Date, default: Date.now },

  telegramChatId: { type: String, default: '' },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false
  }
});

module.exports = mongoose.model('User', userSchema);
