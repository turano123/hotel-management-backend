const mongoose = require('mongoose');

const MuhasebeSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, enum: ['Gelir', 'Gider'], required: true },
  category: String,
  amount: Number,
  note: String,
  userId: String
});

module.exports = mongoose.model('Muhasebe', MuhasebeSchema);
