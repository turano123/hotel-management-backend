const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  reservationId: String,
  companyId: String,
  amount: Number,
  currency: String,
  method: String,
  note: String,
  createdAt: Date
});

module.exports = mongoose.model('Payment', paymentSchema);
