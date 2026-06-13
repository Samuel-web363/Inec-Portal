const express = require('express')
const router = express.Router()
const { Result, Party, Candidate } = require('../models')
const { verifyToken, requireAdmin, logActivity } = require('../middleware/auth')
const { sendResultUploadEmail } = require('../utils/email')
const User = require('../models/User')

// GET /api/results/summary — aggregated stats (public)
router.get('/summary', async (req, res) => {
  try {
    const [totalResults, totalVotes, totalParties, totalCandidates, totalUsers,
           partyVotesRaw, stateResultsRaw, uploadsByDateRaw] = await Promise.all([
      Result.countDocuments(),
      Result.aggregate([{ $group: { _id: null, total: { $sum: '$votesReceived' } } }]),
      Party.countDocuments({ isActive: true }),
      Candidate.countDocuments({ isActive: true }),
      require('../models/User').countDocuments(),
      Result.aggregate([
        { $lookup: { from: 'parties', localField: 'partyId', foreignField: '_id', as: 'party' } },
        { $unwind: { path: '$party', preserveNullAndEmptyArrays: true } },
        { $group: { _id: '$party.abbreviation', votes: { $sum: '$votesReceived' } } },
        { $sort: { votes: -1 } }, { $limit: 10 },
        { $project: { _id: 0, party: { $ifNull: ['$_id', 'Other'] }, votes: 1 } }
      ]),
      Result.aggregate([
        { $group: { _id: '$state', count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 8 },
        { $project: { _id: 0, state: '$_id', count: 1 } }
      ]),
      Result.aggregate([
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }, { $limit: 30 },
        { $project: { _id: 0, date: '$_id', count: 1 } }
      ])
    ])

    res.json({
      totalResults,
      totalVotes: totalVotes[0]?.total || 0,
      totalParties,
      totalCandidates,
      totalUsers,
      partyVotes: partyVotesRaw,
      stateResults: stateResultsRaw,
      uploadsByDate: uploadsByDateRaw
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch summary' })
  }
})

// GET /api/results — public with filters + pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 15, state, lga, ward, party, candidate } = req.query
    const filter = {}
    if (state) filter.state = new RegExp(state, 'i')
    if (lga)   filter.lga   = new RegExp(lga, 'i')
    if (ward)  filter.ward  = new RegExp(ward, 'i')

    let candidateIds, partyIds

    if (party) {
      const parties = await Party.find({ $or: [{ name: new RegExp(party, 'i') }, { abbreviation: new RegExp(party, 'i') }] }).select('_id')
      partyIds = parties.map(p => p._id)
      if (partyIds.length) filter.partyId = { $in: partyIds }
      else filter.partyId = null
    }

    if (candidate) {
      const candidates = await Candidate.find({ fullName: new RegExp(candidate, 'i') }).select('_id')
      candidateIds = candidates.map(c => c._id)
      if (candidateIds.length) filter.candidateId = { $in: candidateIds }
      else filter.candidateId = null
    }

    const total = await Result.countDocuments(filter)
    const results = await Result.find(filter)
      .populate('partyId', 'name abbreviation')
      .populate('candidateId', 'fullName state')
      .populate('uploadedBy', 'fullName')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))

    res.json({ results, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch results' })
  }
})

// POST /api/results — admin only
router.post('/', verifyToken, requireAdmin, logActivity('Upload Result', req => `${req.body.electionType} - ${req.body.state}`), async (req, res) => {
  try {
    const result = await Result.create({ ...req.body, uploadedBy: req.user._id })
    res.status(201).json(result)

    // Send email to all verified users (non-blocking, only every 10th upload to avoid spam)
    setImmediate(async () => {
      try {
        const total = await Result.countDocuments()
        if (total % 10 === 1) { // only on first, 11th, 21st uploads etc
          const users = await User.find({ isVerified: true, isActive: true }).select('email fullName')
          await Promise.allSettled(users.map(u =>
            sendResultUploadEmail(u.email, u.fullName, result).catch(() => {})
          ))
        }
      } catch {}
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload result' })
  }
})

// PUT /api/results/:id — admin only
router.put('/:id', verifyToken, requireAdmin, logActivity('Update Result', req => req.params.id), async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!result) return res.status(404).json({ message: 'Result not found' })
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update result' })
  }
})

// DELETE /api/results/:id — admin only
router.delete('/:id', verifyToken, requireAdmin, logActivity('Delete Result', req => req.params.id), async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id)
    if (!result) return res.status(404).json({ message: 'Result not found' })
    res.json({ message: 'Result deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete result' })
  }
})

module.exports = router
