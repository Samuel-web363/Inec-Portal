const express = require('express')
const router = express.Router()
const { Candidate } = require('../models')
const { verifyToken, requireAdmin, logActivity } = require('../middleware/auth')

// GET /api/candidates — authenticated
router.get('/', verifyToken, async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('partyId', 'name abbreviation').sort({ fullName: 1 })
    res.json(candidates)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch candidates' })
  }
})

// POST /api/candidates — admin
router.post('/', verifyToken, requireAdmin, logActivity('Create Candidate', req => req.body.fullName), async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body)
    res.status(201).json(candidate)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create candidate' })
  }
})

// PUT /api/candidates/:id — admin
router.put('/:id', verifyToken, requireAdmin, logActivity('Update Candidate', req => req.params.id), async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' })
    res.json(candidate)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update candidate' })
  }
})

// DELETE /api/candidates/:id — admin
router.delete('/:id', verifyToken, requireAdmin, logActivity('Delete Candidate', req => req.params.id), async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id)
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' })
    res.json({ message: 'Candidate deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete candidate' })
  }
})

module.exports = router
