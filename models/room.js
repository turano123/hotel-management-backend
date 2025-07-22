const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    // — Temel bilgiler —
    roomNo:     { type: String,  required: true, unique: true },
    name:       { type: String,  required: true },
    bedCount:   { type: Number,  required: true },
    maxAdults:  { type: Number,  default: 0 },
    maxChildren:{ type: Number,  default: 0 },

    weekPrice:     { type: Number, default: 0 },  // Hafta içi
    weekendPrice:  { type: Number, default: 0 },  // Hafta sonu

    // — Özellikler (isteğe bağlı) —
    jacuzzi:        { type: Boolean, default: false },
    hotPool:        { type: Boolean, default: false },
    hasPool:        { type: Boolean, default: false },
    poolType:       { type: String,  enum: ['', 'normal', 'oval', 'kosegen'] },
    poolDiameter:   Number,
    poolWidth:      Number,
    poolHeight:     Number,

    view:           [String],         // ['Dağ', 'Deniz', ...]
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

module.exports = mongoose.model('Room', roomSchema);
