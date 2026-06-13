const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { verifyToken, logActivity } = require('../middleware/auth')

// GET /api/profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash -otpCode -otpExpiry')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
})

// PUT /api/profile
router.put('/', verifyToken, logActivity('Update Profile'), async (req, res) => {
  try {
    const { fullName, nin } = req.body
    const updates = {}
    if (fullName) updates.fullName = fullName.trim()
    if (nin)      updates.nin = nin.trim()

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-passwordHash -otpCode -otpExpiry')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' })
  }
})

module.exports = router
