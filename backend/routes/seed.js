const express = require('express')
const router = express.Router()
const { Party, Candidate, Result } = require('../models')
const { verifyToken, requireAdmin, logActivity } = require('../middleware/auth')

const PARTIES = [
  { name: 'All Progressives Congress', abbreviation: 'APC', description: "Nigeria's ruling party, formed in 2013 through a merger of major opposition parties." },
  { name: 'Peoples Democratic Party', abbreviation: 'PDP', description: "Nigeria's oldest major party, ruled from 1999 to 2015." },
  { name: 'Labour Party', abbreviation: 'LP', description: 'Social democratic party that gained major prominence in the 2023 elections.' },
  { name: 'New Nigeria Peoples Party', abbreviation: 'NNPP', description: 'Northern-based party that performed strongly in Kano in 2023.' },
  { name: 'All Progressives Grand Alliance', abbreviation: 'APGA', description: 'Dominant party in the Southeast, particularly Anambra State.' }
]

const CANDIDATES = [
  { fullName: 'Bola Ahmed Tinubu', party: 'APC', state: 'Lagos', position: 'Presidential Candidate' },
  { fullName: 'Atiku Abubakar', party: 'PDP', state: 'Adamawa', position: 'Presidential Candidate' },
  { fullName: 'Peter Gregory Obi', party: 'LP', state: 'Anambra', position: 'Presidential Candidate' },
  { fullName: 'Rabiu Musa Kwankwaso', party: 'NNPP', state: 'Kano', position: 'Presidential Candidate' },
  { fullName: 'Babajide Sanwo-Olu', party: 'APC', state: 'Lagos', position: 'Governorship Candidate' },
  { fullName: 'Seyi Makinde', party: 'PDP', state: 'Oyo', position: 'Governorship Candidate' },
  { fullName: 'Charles Soludo', party: 'APGA', state: 'Anambra', position: 'Governorship Candidate' },
  { fullName: 'Abba Kabir Yusuf', party: 'NNPP', state: 'Kano', position: 'Governorship Candidate' },
  { fullName: 'Alex Otti', party: 'LP', state: 'Abia', position: 'Governorship Candidate' },
  { fullName: 'Godswill Akpabio', party: 'APC', state: 'Akwa Ibom', position: 'Senatorial Candidate' },
  { fullName: 'Ned Nwoko', party: 'PDP', state: 'Delta', position: 'Senatorial Candidate' },
  { fullName: 'Tajudeen Abbas', party: 'APC', state: 'Kaduna', position: 'House of Representatives' }
]

const RESULTS = [
  { candidate: 'Bola Ahmed Tinubu', type: 'Presidential', state: 'Lagos', lga: 'Ikeja', ward: 'Ward 1', pollingUnit: 'Unit A', votes: 8794726, date: '2023-02-25' },
  { candidate: 'Atiku Abubakar', type: 'Presidential', state: 'Adamawa', lga: 'Yola North', ward: 'Ward 2', pollingUnit: 'Unit B', votes: 6984520, date: '2023-02-25' },
  { candidate: 'Peter Gregory Obi', type: 'Presidential', state: 'Anambra', lga: 'Awka South', ward: 'Ward 3', pollingUnit: 'Unit C', votes: 6101533, date: '2023-02-25' },
  { candidate: 'Rabiu Musa Kwankwaso', type: 'Presidential', state: 'Kano', lga: 'Kano Municipal', ward: 'Ward 4', pollingUnit: 'Unit D', votes: 1496687, date: '2023-02-25' },
  { candidate: 'Babajide Sanwo-Olu', type: 'Gubernatorial', state: 'Lagos', lga: 'Lagos Island', ward: 'Ward 1', pollingUnit: 'Unit A', votes: 762134, date: '2023-03-18' },
  { candidate: 'Seyi Makinde', type: 'Gubernatorial', state: 'Oyo', lga: 'Ibadan North', ward: 'Ward 2', pollingUnit: 'Unit B', votes: 563283, date: '2023-03-18' },
  { candidate: 'Charles Soludo', type: 'Gubernatorial', state: 'Anambra', lga: 'Awka South', ward: 'Ward 1', pollingUnit: 'Unit A', votes: 103946, date: '2023-03-18' },
  { candidate: 'Abba Kabir Yusuf', type: 'Gubernatorial', state: 'Kano', lga: 'Kano Municipal', ward: 'Ward 3', pollingUnit: 'Unit C', votes: 994885, date: '2023-03-18' },
  { candidate: 'Alex Otti', type: 'Gubernatorial', state: 'Abia', lga: 'Umuahia North', ward: 'Ward 2', pollingUnit: 'Unit B', votes: 175467, date: '2023-03-18' },
  { candidate: 'Godswill Akpabio', type: 'Senatorial', state: 'Akwa Ibom', lga: 'Ikot Ekpene', ward: 'Ward 1', pollingUnit: 'Unit A', votes: 106572, date: '2023-02-25' },
  { candidate: 'Ned Nwoko', type: 'Senatorial', state: 'Delta', lga: 'Aniocha North', ward: 'Ward 2', pollingUnit: 'Unit B', votes: 89341, date: '2023-02-25' },
  { candidate: 'Tajudeen Abbas', type: 'House of Representatives', state: 'Kaduna', lga: 'Zaria', ward: 'Ward 1', pollingUnit: 'Unit A', votes: 47823, date: '2023-02-25' }
]

// POST /api/seed — admin only — seeds demo 2023 election data
router.post('/', verifyToken, requireAdmin, logActivity('Seed Demo Data'), async (req, res) => {
  try {
    const existingParties = await Party.countDocuments()
    const existingCandidates = await Candidate.countDocuments()
    const existingResults = await Result.countDocuments()

    if (existingParties > 0 || existingCandidates > 0 || existingResults > 0) {
      return res.status(409).json({
        message: 'Database is not empty. Seeding is only allowed on an empty database to prevent duplicates.',
        existing: { parties: existingParties, candidates: existingCandidates, results: existingResults }
      })
    }

    // 1. Create parties
    const createdParties = await Party.insertMany(PARTIES)
    const partyMap = {}
    createdParties.forEach(p => { partyMap[p.abbreviation] = p._id })

    // 2. Create candidates
    const candidatesToCreate = CANDIDATES.map(c => ({
      fullName: c.fullName,
      partyId: partyMap[c.party],
      state: c.state,
      position: c.position,
      isActive: true
    }))
    const createdCandidates = await Candidate.insertMany(candidatesToCreate)
    const candidateMap = {}
    createdCandidates.forEach(c => { candidateMap[c.fullName] = { id: c._id, partyId: c.partyId } })

    // 3. Create results
    const resultsToCreate = RESULTS.map(r => {
      const cand = candidateMap[r.candidate]
      return {
        electionType: r.type,
        electionDate: new Date(r.date),
        state: r.state,
        lga: r.lga,
        ward: r.ward,
        pollingUnit: r.pollingUnit,
        partyId: cand?.partyId,
        candidateId: cand?.id,
        votesReceived: r.votes,
        uploadedBy: req.user._id,
        verifiedStatus: true
      }
    })
    await Result.insertMany(resultsToCreate)

    res.status(201).json({
      message: 'Demo data seeded successfully!',
      seeded: {
        parties: createdParties.length,
        candidates: createdCandidates.length,
        results: resultsToCreate.length
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to seed demo data' })
  }
})

// DELETE /api/seed — admin only — wipes all parties, candidates, results
router.delete('/', verifyToken, requireAdmin, logActivity('Clear All Data'), async (req, res) => {
  try {
    await Promise.all([
      Party.deleteMany({}),
      Candidate.deleteMany({}),
      Result.deleteMany({})
    ])
    res.json({ message: 'All parties, candidates, and results have been cleared.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear data' })
  }
})

module.exports = router
