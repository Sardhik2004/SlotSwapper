const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
  mySlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  theirSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['PENDING','ACCEPTED','REJECTED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', SwapRequestSchema);
