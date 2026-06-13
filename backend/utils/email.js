const axios = require('axios')

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendOTPEmail(to, otp, type = 'verify') {
  const subject = type === 'login'
    ? 'IReV Portal — Login Verification Code'
    : 'IReV Portal — Email Verification Code'
  const action = type === 'login' ? 'complete your login' : 'verify your email address'

  await axios.post('https://api.brevo.com/v3/smtp/email', {
    sender: { name: 'IReV Portal', email: 'irevportal@gmail.com' },
    to: [{ email: to }],
    subject,
    htmlContent: `<div style="font-family:Arial;max-width:520px;margin:0 auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
      <div style="background:#006400;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;">IReV Electoral Portal</h1>
      </div>
      <div style="padding:32px;">
        <p>Use the code below to ${action}. Expires in <strong>10 minutes</strong>.</p>
        <div style="background:#f7f8f6;border:2px solid #006400;border-radius:8px;padding:20px;text-align:center;margin:24px 0;">
          <span style="font-size:2.2rem;font-weight:700;letter-spacing:0.3em;color:#006400;">${otp}</span>
        </div>
        <p style="color:#9e9e9e;font-size:0.8rem;">If you did not request this, ignore this email.</p>
      </div>
    </div>`
  }, {
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json'
    }
  })
}

async function sendVotingOpenEmail(to, fullName, election) {
  await axios.post('https://api.brevo.com/v3/smtp/email', {
    sender: { name: 'IReV Portal', email: email: 'irevportal@gmail.com' },
    to: [{ email: to }],
    subject: `🗳️ Voting is Now Open: ${election.title}`,
    htmlContent: `<p>Dear ${fullName}, voting is now open for <strong>${election.title}</strong>.</p>`
  }, { headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' } })
}

async function sendResultUploadEmail(to, fullName, result) {
  await axios.post('https://api.brevo.com/v3/smtp/email', {
    sender: { name: 'IReV Portal', email: email: 'irevportal@gmail.com' },
    to: [{ email: to }],
    subject: `📊 New Result Published: ${result.electionType} — ${result.state}`,
    htmlContent: `<p>Dear ${fullName}, a new result has been published for <strong>${result.electionType}</strong> in ${result.state}.</p>`
  }, { headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' } })
}

module.exports = { generateOTP, sendOTPEmail, sendVotingOpenEmail, sendResultUploadEmail }
