const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendOTPEmail(to, otp, type = 'verify') {
  const subject = type === 'login'
    ? 'IReV Portal — Login Verification Code'
    : 'IReV Portal — Email Verification Code'

  await resend.emails.send({
    from: 'IReV Portal <onboarding@resend.dev>',
    to,
    subject,
    html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
  })
}

async function sendVotingOpenEmail(to, fullName, election) {}
async function sendResultUploadEmail(to, fullName, result) {}

module.exports = { generateOTP, sendOTPEmail, sendVotingOpenEmail, sendResultUploadEmail }
