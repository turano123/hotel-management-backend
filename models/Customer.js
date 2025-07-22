const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 🔐 Kime ait
  name:       { type: String, required: true },
  surname:    { type: String },
  phone:      { type: String },
  email:      { type: String },
  notes:      { type: String },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', CustomerSchema);
