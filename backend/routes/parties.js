const express = require('express')
const router = express.Router()
const { Party } = require('../models')
const { verifyToken, requireAdmin, logActivity } = require('../middleware/auth')

// GET /api/parties — authenticated
router.get('/', verifyToken, async (req, res) => {
  try {
    const parties = await Party.find().sort({ abbreviation: 1 })
    res.json(parties)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch parties' })
  }
})

// POST /api/parties — admin
router.post('/', verifyToken, requireAdmin, logActivity('Create Party', req => req.body.abbreviation), async (req, res) => {
  try {
    const party = await Party.create(req.body)
    res.status(201).json(party)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create party' })
  }
})

// PUT /api/parties/:id — admin
router.put('/:id', verifyToken, requireAdmin, logActivity('Update Party', req => req.params.id), async (req, res) => {
  try {
    const party = await Party.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!party) return res.status(404).json({ message: 'Party not found' })
    res.json(party)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update party' })
  }
})

// DELETE /api/parties/:id — admin
router.delete('/:id', verifyToken, requireAdmin, logActivity('Delete Party', req => req.params.id), async (req, res) => {
  try {
    const party = await Party.findByIdAndDelete(req.params.id)
    if (!party) return res.status(404).json({ message: 'Party not found' })
    res.json({ message: 'Party deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete party' })
  }
})

module.exports = router
