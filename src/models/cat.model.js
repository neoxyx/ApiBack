const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  breedId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  temperament: { type: String },
  origin: { type: String },
  lifeSpan: { type: String },
  adaptability: { type: Number },
  intelligence: { type: Number },
  referenceImageId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Cat', catSchema);