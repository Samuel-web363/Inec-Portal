const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
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

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
      <div style="background: #006400; padding: 24px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 1.3rem; font-family: Georgia, serif;">IReV Electoral Portal</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 0.8rem;">Independent National Electoral Commission</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #2c2c2c; font-size: 1.1rem; margin-bottom: 12px;">Verification Code</h2>
        <p style="color: #5a5a5a; font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">
          Use the code below to ${action}. This code expires in <strong>10 minutes</strong>.
        </p>
        <div style="background: #f7f8f6; border: 2px solid #006400; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 2.2rem; font-weight: 700; letter-spacing: 0.3em; color: #006400; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #9e9e9e; font-size: 0.8rem; line-height: 1.5;">
          If you did not request this code, please ignore this email. Do not share this code with anyone.
        </p>
      </div>
      <div style="background: #f0f0f0; padding: 16px 32px; font-size: 0.75rem; color: #9e9e9e;">
        &copy; ${new Date().getFullYear()} IReV Portal — Student Demonstration Project
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"IReV Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  })
}

async function sendVotingOpenEmail(to, fullName, election) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
      <div style="background: #006400; padding: 24px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 1.3rem; font-family: Georgia,serif;">IReV Electoral Portal</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 0.8rem;">Independent National Electoral Commission</p>
      </div>
      <div style="padding: 32px;">
        <div style="background: #e8f5e9; border-left: 4px solid #006400; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 0.9rem; color: #2e7d32; font-weight: 600;">
            🗳️ Voting is now LIVE!
          </p>
        </div>
        <h2 style="color: #2c2c2c; font-size: 1.1rem; margin-bottom: 10px;">Dear ${fullName},</h2>
        <p style="color: #5a5a5a; font-size: 0.95rem; line-height: 1.6; margin-bottom: 16px;">
          The following mock election is now open for voting on the IReV Portal:
        </p>
        <div style="background: #f7f8f6; border: 1.5px solid #006400; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
          <p style="font-size: 1rem; font-weight: 700; color: #006400; margin: 0 0 6px;">${election.title}</p>
          <p style="font-size: 0.85rem; color: #5a5a5a; margin: 0;">${election.electionType} · ${election.year}</p>
        </div>
        <p style="color: #5a5a5a; font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px;">
          Log in to the IReV Portal to cast your vote. Each registered user can vote once per election. Results update in real time as votes are cast.
        </p>
        <div style="text-align: center;">
          <a href="${process.env.CLIENT_URL}/elections" style="display: inline-block; background: #006400; color: #ffffff; padding: 13px 32px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; text-decoration: none;">
            Vote Now
          </a>
        </div>
        <p style="color: #9e9e9e; font-size: 0.78rem; line-height: 1.5; margin-top: 24px;">
          This is a simulated election for demonstration purposes only. Not affiliated with INEC Nigeria.
        </p>
      </div>
      <div style="background: #f0f0f0; padding: 16px 32px; font-size: 0.75rem; color: #9e9e9e;">
        &copy; ${new Date().getFullYear()} IReV Portal — Student Demonstration Project
      </div>
    </div>
  `
  await transporter.sendMail({
    from: `"IReV Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🗳️ Voting is Now Open: ${election.title}`,
    html
  })
}

async function sendResultUploadEmail(to, fullName, result) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
      <div style="background: #006400; padding: 24px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 1.3rem; font-family: Georgia,serif;">IReV Electoral Portal</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 0.8rem;">Independent National Electoral Commission</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #2c2c2c; font-size: 1.1rem; margin-bottom: 10px;">Dear ${fullName},</h2>
        <p style="color: #5a5a5a; font-size: 0.95rem; line-height: 1.6; margin-bottom: 16px;">
          A new election result has been published on the IReV Portal:
        </p>
        <table style="width: 100%; border-collapse: collapse; background: #f7f8f6; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
          <tr><td style="padding: 10px 16px; font-size: 0.82rem; color: #5a5a5a; border-bottom: 1px solid #e0e0e0;">Election Type</td><td style="padding: 10px 16px; font-weight: 600; color: #2c2c2c; border-bottom: 1px solid #e0e0e0;">${result.electionType}</td></tr>
          <tr><td style="padding: 10px 16px; font-size: 0.82rem; color: #5a5a5a; border-bottom: 1px solid #e0e0e0;">State</td><td style="padding: 10px 16px; font-weight: 600; color: #2c2c2c; border-bottom: 1px solid #e0e0e0;">${result.state}</td></tr>
          <tr><td style="padding: 10px 16px; font-size: 0.82rem; color: #5a5a5a;">Votes Received</td><td style="padding: 10px 16px; font-weight: 700; color: #006400;">${result.votesReceived?.toLocaleString()}</td></tr>
        </table>
        <div style="text-align: center;">
          <a href="${process.env.CLIENT_URL}/results" style="display: inline-block; background: #006400; color: #ffffff; padding: 13px 32px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; text-decoration: none;">
            View Results
          </a>
        </div>
      </div>
      <div style="background: #f0f0f0; padding: 16px 32px; font-size: 0.75rem; color: #9e9e9e;">
        &copy; ${new Date().getFullYear()} IReV Portal — Student Demonstration Project
      </div>
    </div>
  `
  await transporter.sendMail({
    from: `"IReV Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject: `📊 New Result Published: ${result.electionType} — ${result.state}`,
    html
  })
}

module.exports = { generateOTP, sendOTPEmail, sendVotingOpenEmail, sendResultUploadEmail }
