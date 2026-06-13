const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { ActivityLog } = require('../models')
const { verifyToken, requireAdmin, logActivity } = require('../middleware/auth')

// GET /api/users/activity-logs — admin only
// IMPORTANT: this must be defined BEFORE /:id routes or Express matches "activity-logs" as an :id
router.get('/activity-logs', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const total = await ActivityLog.countDocuments()
    const logs = await ActivityLog.find()
      .populate('userId', 'fullName email')
      .sort({ timestamp: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
    res.json({ logs, total, page: Number(page) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch activity logs' })
  }
})

// GET /api/users — admin only
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-passwordHash -otpCode -otpExpiry')
      .sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

// PUT /api/users/:id/deactivate — admin only
router.put('/:id/deactivate', verifyToken, requireAdmin, logActivity('Deactivate User', req => req.params.id), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'User deactivated', user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to deactivate user' })
  }
})

module.exports = router
