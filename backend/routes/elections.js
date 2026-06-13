const express = require('express')
const router = express.Router()
const { Election, Vote } = require('../models/voting')
const { Candidate } = require('../models')
const { verifyToken, requireAdmin, logActivity } = require('../middleware/auth')
const { sendVotingOpenEmail } = require('../utils/email')
const User = require('../models/User')

// ── GET /api/elections — get all elections (public) ────────────────────
router.get('/', async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('candidates', 'fullName partyId state position')
      .sort({ createdAt: -1 })
    res.json(elections)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch elections' })
  }
})

// ── GET /api/elections/:id — get single election ───────────────────────
router.get('/:id', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate({
        path: 'candidates',
        populate: { path: 'partyId', select: 'name abbreviation' }
      })
    if (!election) return res.status(404).json({ message: 'Election not found' })
    res.json(election)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch election' })
  }
})

// ── GET /api/elections/:id/results — live vote counts ─────────────────
router.get('/:id/results', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate({
        path: 'candidates',
        populate: { path: 'partyId', select: 'name abbreviation' }
      })
    if (!election) return res.status(404).json({ message: 'Election not found' })

    // Get vote counts per candidate
    const voteCounts = await Vote.aggregate([
      { $match: { electionId: election._id } },
      { $group: { _id: '$candidateId', votes: { $sum: 1 } } }
    ])

    const voteMap = {}
    voteCounts.forEach(v => { voteMap[v._id.toString()] = v.votes })

    const totalVotes = voteCounts.reduce((sum, v) => sum + v.votes, 0)

    const results = election.candidates.map(c => ({
      _id: c._id,
      fullName: c.fullName,
      party: c.partyId?.abbreviation || 'Independent',
      partyName: c.partyId?.name || '',
      state: c.state,
      position: c.position,
      votes: voteMap[c._id.toString()] || 0,
      percentage: totalVotes > 0
        ? ((voteMap[c._id.toString()] || 0) / totalVotes * 100).toFixed(1)
        : '0.0'
    }))

    results.sort((a, b) => b.votes - a.votes)

    res.json({
      election: {
        _id: election._id,
        title: election.title,
        electionType: election.electionType,
        status: election.status,
        year: election.year
      },
      results,
      totalVotes
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch results' })
  }
})

// ── GET /api/elections/:id/my-vote — check if user already voted ───────
router.get('/:id/my-vote', verifyToken, async (req, res) => {
  try {
    const vote = await Vote.findOne({
      electionId: req.params.id,
      userId: req.user._id
    }).populate('candidateId', 'fullName')
    res.json({ voted: !!vote, candidate: vote?.candidateId || null })
  } catch (err) {
    res.status(500).json({ message: 'Failed to check vote status' })
  }
})

// ── POST /api/elections/:id/vote — cast a vote ─────────────────────────
router.post('/:id/vote', verifyToken, async (req, res) => {
  try {
    const { candidateId } = req.body

    // Admin cannot vote
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Administrators cannot vote.' })
    }

    const election = await Election.findById(req.params.id)
    if (!election) return res.status(404).json({ message: 'Election not found' })
    if (election.status !== 'open') {
      return res.status(400).json({ message: 'This election is not currently open for voting.' })
    }

    // Check candidate is part of this election
    if (!election.candidates.map(c => c.toString()).includes(candidateId)) {
      return res.status(400).json({ message: 'Invalid candidate for this election.' })
    }

    // Check if already voted
    const existing = await Vote.findOne({ electionId: req.params.id, userId: req.user._id })
    if (existing) {
      return res.status(400).json({ message: 'You have already voted in this election.' })
    }

    await Vote.create({
      electionId: req.params.id,
      candidateId,
      userId: req.user._id
    })

    res.status(201).json({ message: 'Vote cast successfully!' })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already voted in this election.' })
    }
    console.error(err)
    res.status(500).json({ message: 'Failed to cast vote' })
  }
})

// ── POST /api/elections — create election (admin) ──────────────────────
router.post('/', verifyToken, requireAdmin, logActivity('Create Election', req => req.body.title), async (req, res) => {
  try {
    const election = await Election.create({ ...req.body, createdBy: req.user._id })
    res.status(201).json(election)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create election' })
  }
})

// ── PUT /api/elections/:id/open — open election (admin) ───────────────
router.put('/:id/open', verifyToken, requireAdmin, logActivity('Open Election', req => req.params.id), async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { status: 'open', openedAt: new Date() },
      { new: true }
    )
    if (!election) return res.status(404).json({ message: 'Election not found' })

    // Send email notifications to all verified active users (non-blocking)
    res.json(election)
    setImmediate(async () => {
      try {
        const users = await User.find({ isVerified: true, isActive: true }).select('email fullName')
        const emailPromises = users.map(u =>
          sendVotingOpenEmail(u.email, u.fullName, election).catch(() => {})
        )
        await Promise.allSettled(emailPromises)
        console.log(`Voting open emails sent to ${users.length} users for: ${election.title}`)
      } catch (err) {
        console.error('Failed to send voting open emails:', err.message)
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to open election' })
  }
})

// ── PUT /api/elections/:id/close — close election (admin) ─────────────
router.put('/:id/close', verifyToken, requireAdmin, logActivity('Close Election', req => req.params.id), async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { status: 'closed', closedAt: new Date() },
      { new: true }
    )
    if (!election) return res.status(404).json({ message: 'Election not found' })
    res.json(election)
  } catch (err) {
    res.status(500).json({ message: 'Failed to close election' })
  }
})

// ── PUT /api/elections/:id — update election (admin) ──────────────────
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!election) return res.status(404).json({ message: 'Election not found' })
    res.json(election)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update election' })
  }
})

// ── DELETE /api/elections/:id — delete election (admin) ───────────────
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await Election.findByIdAndDelete(req.params.id)
    await Vote.deleteMany({ electionId: req.params.id })
    res.json({ message: 'Election deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete election' })
  }
})

module.exports = router
