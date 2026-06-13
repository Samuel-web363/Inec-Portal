const mongoose = require('mongoose')

// ── Election ───────────────────────────────────────────────────────────
const electionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  electionType: { type: String, required: true },
  year: { type: Number, default: 2027 },
  status: { type: String, enum: ['upcoming', 'open', 'closed'], default: 'upcoming' },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  openedAt: { type: Date },
  closedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
})

// ── Vote ───────────────────────────────────────────────────────────────
const voteSchema = new mongoose.Schema({
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  castedAt: { type: Date, default: Date.now }
})

// Prevent double voting — one vote per user per election
voteSchema.index({ electionId: 1, userId: 1 }, { unique: true })

module.exports = {
  Election: mongoose.model('Election', electionSchema),
  Vote: mongoose.model('Vote', voteSchema)
}
