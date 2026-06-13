const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { generateOTP, sendOTPEmail } = require('../utils/email')

const OTP_EXPIRY_MINS = 10

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, nin } = req.body
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'fullName, email, and password are required' })
    }
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    // password is already SHA-256 hashed client-side; bcrypt it server-side
    const passwordHash = await bcrypt.hash(password, 12)
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINS * 60 * 1000)

      const user = await User.create({
      fullName, email: email.toLowerCase(), passwordHash, nin,
      otpCode: otp, otpExpiry, otpType: 'register'
    })

    try {
      await sendOTPEmail(email, otp, 'verify')
    } catch (emailErr) {
      console.error('Email error:', emailErr.message)
    }
    res.status(201).json({ message: 'Registered. Check your email for the verification OTP.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Registration failed' })
  }
})


// POST /api/auth/verify-otp  (registration verification)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' })
    if (!user.otpCode || user.otpCode !== otp) return res.status(400).json({ message: 'Invalid OTP' })
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP has expired' })

    user.isVerified = true
    user.otpCode = undefined
    user.otpExpiry = undefined
    await user.save()

    res.json({ message: 'Email verified. You can now log in.' })
  } catch (err) {
    res.status(500).json({ message: 'Verification failed' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(401).json({ message: 'Invalid email or password' })
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first' })
    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated. Contact admin.' })

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(401).json({ message: 'Invalid email or password' })

    const otp = generateOTP()
    user.otpCode = otp
    user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINS * 60 * 1000)
    user.otpType = 'login'
    await user.save()

    await sendOTPEmail(email, otp, 'login')
    res.json({ message: 'OTP sent to your email. Enter it to complete login.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Login failed' })
  }
})

// POST /api/auth/login-verify-otp
router.post('/login-verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (!user.otpCode || user.otpCode !== otp) return res.status(400).json({ message: 'Invalid OTP' })
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP has expired' })
    if (user.otpType !== 'login') return res.status(400).json({ message: 'Invalid OTP type' })

    user.otpCode = undefined
    user.otpExpiry = undefined
    user.otpType = undefined
    user.lastLogin = new Date()
    await user.save()

    const token = jwt.sign(
      { userId: user._id, email: user.email, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, message: 'Login successful' })
  } catch (err) {
    res.status(500).json({ message: 'Login verification failed' })
  }
})

// POST /api/auth/resend-otp
router.post('/resend-otp', async (req, res) => {
  try {
    const { email, type } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const otp = generateOTP()
    user.otpCode = otp
    user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINS * 60 * 1000)
    user.otpType = type === 'login' ? 'login' : 'register'
    await user.save()

    await sendOTPEmail(email, otp, type === 'login' ? 'login' : 'verify')
    res.json({ message: 'New OTP sent to your email.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to resend OTP' })
  }
})

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ message: 'No account found with that email address.' })

    const otp = generateOTP()
    user.otpCode = otp
    user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINS * 60 * 1000)
    user.otpType = 'reset'
    await user.save()

    await sendOTPEmail(email, otp, 'verify')
    res.json({ message: 'Password reset code sent to your email.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to send reset code.' })
  }
})

// POST /api/auth/verify-reset-otp
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ message: 'User not found.' })
    if (!user.otpCode || user.otpCode !== otp) return res.status(400).json({ message: 'Invalid OTP code.' })
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP has expired. Please request a new one.' })
    if (user.otpType !== 'reset') return res.status(400).json({ message: 'Invalid OTP type.' })
    res.json({ message: 'OTP verified.' })
  } catch (err) {
    res.status(500).json({ message: 'Verification failed.' })
  }
})

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, password } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ message: 'User not found.' })
    if (!user.otpCode || user.otpCode !== otp) return res.status(400).json({ message: 'Invalid or expired reset code.' })
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: 'Reset code has expired.' })
    if (user.otpType !== 'reset') return res.status(400).json({ message: 'Invalid OTP type.' })

    const passwordHash = await bcrypt.hash(password, 12)
    user.passwordHash = passwordHash
    user.otpCode = undefined
    user.otpExpiry = undefined
    user.otpType = undefined
    await user.save()

    res.json({ message: 'Password reset successfully. You can now log in.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Password reset failed.' })
  }
})

module.exports = router
