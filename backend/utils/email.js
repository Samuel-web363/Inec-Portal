const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: 'aea429001@smtp-brevo.com',
    pass: process.env.BREVO_SMTP_PASS
  }
})

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendOTPEmail(to, otp, type = 'verify') {
  const subject = type === 'login'
    ? 'IReV Portal — Login Verification Code'
    : 'IReV Portal — Email Verification Code'
  const action = type === 'login' ? 'complete your login' : 'verify your email address'

  await transporter.sendMail({
    from: '"IReV Portal" <aea429001@smtp-brevo.com>',
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
        <div style="background: #006400; padding: 24px 32px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 1.3rem;">IReV Electoral Portal</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 0.8rem;">Independent National Electoral Commission</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #2c2c2c;">Verification Code</h2>
          <p style="color: #5a5a5a;">Use the code below to ${action}. Expires in <strong>10 minutes</strong>.</p>
          <div style="background: #f7f8f6; border: 2px solid #006400; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 2.2rem; font-weight: 700; letter-spacing: 0.3em; color: #006400;">${otp}</span>
          </div>
          <p style="color: #9e9e9e; font-size: 0.8rem;">If you did not request this code, please ignore this email.</p>
        </div>
        <div style="background: #f0f0f0; padding: 16px 32px; font-size: 0.75rem; color: #9e9e9e;">
          &copy; ${new Date().getFullYear()} IReV Portal — Student Demonstration Project
        </div>
      </div>
    `
  })
}

async function sendVotingOpenEmail(to, fullName, election) {
  await transporter.sendMail({
    from: '"IReV Portal" <aea429001@smtp-brevo.com>',
    to,
    subject: `🗳️ Voting is Now Open: ${election.title}`,
    html: `<p>Dear ${fullName}, voting is now open for <strong>${election.title}</strong>. Log in to cast your vote.</p>`
  })
}

async function sendResultUploadEmail(to, fullName, result) {
  await transporter.sendMail({
    from: '"IReV Portal" <aea429001@smtp-brevo.com>',
    to,
    subject: `📊 New Result Published: ${result.electionType} — ${result.state}`,
    html: `<p>Dear ${fullName}, a new result has been published for <strong>${result.electionType}</strong> in ${result.state}.</p>`
  })
}

module.exports = { generateOTP, sendOTPEmail, sendVotingOpenEmail, sendResultUploadEmail }
