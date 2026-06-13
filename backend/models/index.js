const mongoose = require('mongoose')

// ── Party ──────────────────────────────────────────────────────────────
const partySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  abbreviation: { type: String, required: true, trim: true, uppercase: true },
  logoUrl: { type: String },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

// ── Candidate ──────────────────────────────────────────────────────────
const candidateSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  partyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  state: { type: String, required: true, trim: true },
  position: { type: String, trim: true },
  photoUrl: { type: String },
  bio: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

// ── Result ─────────────────────────────────────────────────────────────
const resultSchema = new mongoose.Schema({
  electionType: { type: String, required: true, trim: true },
  electionDate: { type: Date },
  state: { type: String, required: true, trim: true },
  lga: { type: String, trim: true },
  ward: { type: String, trim: true },
  pollingUnit: { type: String, trim: true },
  partyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
  votesReceived: { type: Number, required: true, min: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedStatus: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

// Indexes for filtering
resultSchema.index({ state: 1, lga: 1, ward: 1 })
resultSchema.index({ partyId: 1, candidateId: 1 })
resultSchema.index({ createdAt: -1 })

// ── ActivityLog ────────────────────────────────────────────────────────
const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  targetResource: { type: String },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
})

module.exports = {
  Party: mongoose.model('Party', partySchema),
  Candidate: mongoose.model('Candidate', candidateSchema),
  Result: mongoose.model('Result', resultSchema),
  ActivityLog: mongoose.model('ActivityLog', activityLogSchema)
}
