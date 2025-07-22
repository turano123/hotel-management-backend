// models/Reservation.js
const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true  // 💥 Hangi kullanıcıya ait olduğu zorunlu
  },
  roomNo: String,
  customer: String,
  checkIn: Date,
  checkOut: Date,
  total: Number,
  deposit: Number,
  remaining: Number,
  reference: String,
  pension: String,
  adults: Number,
  children: Number,
  phone: String,
  nationality: String,
  tcNo: String,
  passportNo: String,
  extraRequestChecked: Boolean,
  extraDescription: String,
  extraPrice: Number,
  notes: [String],
  expenses: [
    {
      desc: String,
      amount: Number,
      currency: String
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', ReservationSchema);
