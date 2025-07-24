const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 💡 Kullanıcıya bağlı olsun

    // — Temel bilgiler —
    roomNo:     { type: String,  required: true },
    name:       { type: String,  required: true },
    bedCount:   { type: Number,  required: true },
    maxAdults:  { type: Number,  default: 0 },
    maxChildren:{ type: Number,  default: 0 },

    weekPrice:     { type: Number, default: 0 },
    weekendPrice:  { type: Number, default: 0 },

    // — Özellikler (isteğe bağlı) —
    jacuzzi:        { type: Boolean, default: false },
    hotPool:        { type: Boolean, default: false },
    hasPool:        { type: Boolean, default: false },
    poolType:       { type: String,  enum: ['', 'normal', 'oval', 'kosegen'] },
    poolDiameter:   Number,
    poolWidth:      Number,
    poolHeight:     Number,

    view:           [String],
    familyOnly:     { type: String, enum: ['Evet', 'Hayır'], default: 'Hayır' },
    petsAllowed:    { type: String, enum: ['Evet', 'Hayır'], default: 'Hayır' },

    firePit:        { type: Boolean, default: false },
    fireplace:      { type: Boolean, default: false },
    sauna:          { type: Boolean, default: false },
    steamRoom:      { type: Boolean, default: false },

    conservative:   { type: String, enum: ['Evet', 'Hayır'], default: 'Hayır' },
    poolShared:     { type: String, enum: ['ortak', 'özel'], default: 'ortak' },
    jacuzziLocation:{ type: String, enum: ['', 'içmekan', 'dışmekan'] },

    washingMachine: { type: Boolean, default: false },
    dishwasher:     { type: Boolean, default: false },
    iron:           { type: Boolean, default: false },
    bathroomCount:  Number,
    stove:          { type: Boolean, default: false },
    kitchen:        { type: Boolean, default: false },

    closedAll:      { type: Boolean, default: false },
    closedPeriods:  [
      {
        start: Date,
        end:   Date
      }
    ]
  },
  { timestamps: true }
);

// 💫 roomNo + userId kombinasyonu benzersiz olmalı
roomSchema.index({ roomNo: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);
