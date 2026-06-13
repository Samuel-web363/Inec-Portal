const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { ActivityLog } = require('../models')

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-passwordHash -otpCode')
    if (!user) return res.status(401).json({ message: 'User not found' })
    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

const logActivity = (action, getResource) => async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode < 400 && req.user) {
      try {
        await ActivityLog.create({
          userId: req.user._id,
          action,
          targetResource: getResource ? getResource(req) : undefined,
          ipAddress: req.ip
        })
      } catch {}
    }
  })
  next()
}

module.exports = { verifyToken, requireAdmin, logActivity }
