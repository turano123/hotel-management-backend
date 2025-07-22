const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName:      { type: String, required: true },
  lastName:       { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  phone:          { type: String, required: true },
  identityNo:     { type: String, required: true },
  taxNo:          { type: String, required: true },
  taxOffice:      { type: String, required: true },
  companyName:    { type: String, required: true },           // Otel / Firma adı
  authorizedPerson: { type: String, required: true },         // Yetkili kişi adı
  address:        { type: String, required: true },

  password:       { type: String, required: true },

  tourismCert:    { type: String, enum: ['Var', 'Yok'], default: 'Yok' },
  tourismCertNo:  { type: String, default: '' },

  vergiFile:      { type: String, required: true },     // Vergi levhası dosya adı
  turizmFile:     { type: String, default: '' },        // Turizm belgesi dosya adı (varsa)

  role:           { type: String, enum: ['admin', 'receptionist', 'customer'], default: 'customer' },

  isActive:       { type: Boolean, default: true },     // Hesap aktif/pasif kontrolü
  createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
