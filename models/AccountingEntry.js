const mongoose = require('mongoose');

const accountingEntrySchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:        { type: String, required: true },
  type:        { type: String, enum: ['Gelir', 'Gider'], required: true },
  category:    { type: String, required: true },
  note:        { type: String },
  amount:      { type: Number, required: true },
  currency:    { type: String, enum: ['₺', '$', '€'], default: '₺' },
  method:      { type: String, default: 'Nakit' },
  commission:  { type: Number, default: 0 },
  kdv:         { type: Number, default: 0 },
  tourismTax:  { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('AccountingEntry', accountingEntrySchema);
