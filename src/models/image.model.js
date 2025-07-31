const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageId: { type: String, required: true, unique: true },
  breedId: { type: String, required: true },
  url: { type: String, required: true },
  width: { type: Number },
  height: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);