// 📁 models/Reservation.js
const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomNo: { type: String },
  customer: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  total: { type: Number, default: 0 },
  deposit: { type: Number, default: 0 },
  remaining: { type: Number, default: 0 },
  reference: { type: String },
  pension: { type: String },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  phone: { type: String },
  nationality: { type: String },
  tcNo: { type: String },
  passportNo: { type: String },
  extraRequestChecked: { type: Boolean, default: false },
  extraDescription: { type: String },
  extraPrice: { type: Number, default: 0 },
  notes: [{ type: String }],
  expenses: [
    {
      desc: { type: String },
      amount: { type: Number, default: 0 },
      currency: { type: String, enum: ['₺', '$', '€'], default: '₺' }
    }
  ],
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', ReservationSchema);
