const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const resultRoutes = require('./routes/results')
const candidateRoutes = require('./routes/candidates')
const partyRoutes = require('./routes/parties')
const userRoutes = require('./routes/users')
const profileRoutes = require('./routes/profile')
const electionRoutes = require('./routes/elections')
const seedRoutes = require('./routes/seed')

const app = express()

// CORS
app.use(cors({
  origin: [
    'https://inec-portal.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint (keep-alive ping target)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/results', resultRoutes)
app.use('/api/candidates', candidateRoutes)
app.use('/api/parties', partyRoutes)
app.use('/api/users', userRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/elections', electionRoutes)
app.use('/api/seed', seedRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  })
})

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Database + server start
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })
