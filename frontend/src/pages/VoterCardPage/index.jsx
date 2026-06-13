import React, { useRef, useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Footer from '../../components/Footer'
import { getCurrentUser } from '../../api/auth'
import './VoterCardPage.css'

export default function VoterCardPage() {
  const user = getCurrentUser()
  const cardRef = useRef()
  const [downloading, setDownloading] = useState(false)

  // Generate a fake VIN (Voter Identification Number)
  const vin = user?.userId
    ? ('VIN' + user.userId.toString().slice(-8).toUpperCase().padStart(8, '0'))
    : 'VIN00000000'

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Create a printable page in a new window
      const card = cardRef.current
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <html>
          <head>
            <title>Voter Card - ${user?.fullName}</title>
            <style>
              body { margin: 0; padding: 40px; font-family: 'Georgia', serif; background: #f5f5f5; display: flex; justify-content: center; }
              .card { width: 340px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
              .card-header { background: #006400; padding: 16px 20px; display: flex; align-items: center; gap: 12px; }
              .card-header img { width: 44px; height: 44px; }
              .header-text h2 { color: white; margin: 0; font-size: 0.9rem; }
              .header-text p { color: rgba(255,255,255,0.7); margin: 2px 0 0; font-size: 0.7rem; }
              .gold-stripe { height: 4px; background: #c9a84c; }
              .card-body { padding: 20px; }
              .card-photo { width: 80px; height: 95px; background: #e0e0e0; border: 2px solid #006400; border-radius: 4px; display: flex; align-items: center; justify-content: center; float: left; margin-right: 16px; margin-bottom: 8px; }
              .card-fields { overflow: hidden; }
              .field { margin-bottom: 10px; }
              .field-label { font-size: 0.62rem; color: #666; text-transform: uppercase; letter-spacing: 0.06em; }
              .field-value { font-size: 0.88rem; font-weight: 700; color: #1a1a1a; }
              .vin-section { background: #f7f8f6; border: 1.5px solid #006400; border-radius: 6px; padding: 10px 14px; margin: 14px 0; text-align: center; }
              .vin-label { font-size: 0.62rem; color: #006400; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; }
              .vin-number { font-size: 1.1rem; font-weight: 900; color: #1a1a1a; letter-spacing: 0.08em; font-family: monospace; }
              .card-footer { background: #006400; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; }
              .footer-text { color: rgba(255,255,255,0.8); font-size: 0.65rem; }
              .badge { background: #c9a84c; color: #1a1a1a; padding: 3px 10px; border-radius: 3px; font-size: 0.65rem; font-weight: 700; }
              .disclaimer { text-align: center; color: #c9a84c; font-size: 0.6rem; padding: 8px; font-style: italic; border-top: 1px solid rgba(255,255,255,0.2); background: #006400; }
              .clearfix::after { content: ''; display: table; clear: both; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="card-header">
                <div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:0.7rem;">INEC</div>
                <div class="header-text">
                  <h2>VOTER'S CARD</h2>
                  <p>Independent National Electoral Commission</p>
                </div>
              </div>
              <div class="gold-stripe"></div>
              <div class="card-body">
                <div class="clearfix">
                  <div class="card-photo">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#006400" stroke-width="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div class="card-fields">
                    <div class="field">
                      <div class="field-label">Full Name</div>
                      <div class="field-value">${user?.fullName || '—'}</div>
                    </div>
                    <div class="field">
                      <div class="field-label">Email</div>
                      <div class="field-value" style="font-size:0.75rem">${user?.email || '—'}</div>
                    </div>
                    <div class="field">
                      <div class="field-label">State of Registration</div>
                      <div class="field-value">Federal Capital Territory</div>
                    </div>
                  </div>
                </div>
                <div class="vin-section">
                  <div class="vin-label">Voter Identification Number</div>
                  <div class="vin-number">${vin}</div>
                </div>
                <div class="field" style="margin-bottom:0">
                  <div class="field-label">Issue Date</div>
                  <div class="field-value">${new Date().toLocaleDateString('en-NG', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
              <div class="card-footer">
                <div class="footer-text">IReV Portal · Nigeria</div>
                <div class="badge">DEMO CARD</div>
              </div>
              <div class="disclaimer">This is a simulated voter card for academic demonstration purposes only</div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => { printWindow.print(); printWindow.close() }, 500)
    } catch {}
    finally { setDownloading(false) }
  }

  return (
    <div className="vc-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">
            <div className="vc-header">
              <div>
                <h1 className="vc-title">My Voter Card</h1>
                <p className="vc-sub">Your mock voter identification card for the IReV Portal</p>
              </div>
              <div className="vc-actions">
                <button className="vc-print-btn" onClick={handlePrint}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  Print Card
                </button>
                <button className="vc-download-btn" onClick={handleDownload} disabled={downloading}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  {downloading ? 'Opening…' : 'Download PDF'}
                </button>
              </div>
            </div>

            <div className="vc-notice">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              This is a simulated voter card generated for demonstration purposes only. It is not a real INEC voter card and has no legal validity.
            </div>

            <div className="vc-layout">
              {/* Card preview */}
              <div className="vc-card-wrap">
                <div className="vc-card" ref={cardRef}>
                  <div className="vc-card-header">
                    <div className="vc-card-logo" aria-hidden="true">
                      <svg viewBox="0 0 40 40" width="38" height="38" fill="none">
                        <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.15)" stroke="#c9a84c" strokeWidth="1.5"/>
                        <text x="20" y="17" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="serif">INEC</text>
                        <path d="M10 24 Q20 30 30 24" stroke="#c9a84c" strokeWidth="1" fill="none"/>
                        <circle cx="20" cy="19" r="2" fill="#c9a84c"/>
                      </svg>
                    </div>
                    <div className="vc-card-header-text">
                      <span className="vc-card-heading">VOTER'S CARD</span>
                      <span className="vc-card-sub">Independent National Electoral Commission</span>
                    </div>
                  </div>
                  <div className="vc-gold-stripe" aria-hidden="true" />
                  <div className="vc-card-body">
                    <div className="vc-card-row">
                      <div className="vc-photo" aria-label="Photo placeholder">
                        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--green-dark)" strokeWidth="1.2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span className="vc-photo-label">PHOTO</span>
                      </div>
                      <div className="vc-fields">
                        <div className="vc-field">
                          <span className="vc-field-label">Full Name</span>
                          <span className="vc-field-value">{user?.fullName || '—'}</span>
                        </div>
                        <div className="vc-field">
                          <span className="vc-field-label">Email Address</span>
                          <span className="vc-field-value vc-field-value--sm">{user?.email || '—'}</span>
                        </div>
                        <div className="vc-field">
                          <span className="vc-field-label">State of Registration</span>
                          <span className="vc-field-value">Federal Capital Territory</span>
                        </div>
                      </div>
                    </div>
                    <div className="vc-vin">
                      <span className="vc-vin-label">Voter Identification Number</span>
                      <span className="vc-vin-number">{vin}</span>
                    </div>
                    <div className="vc-field">
                      <span className="vc-field-label">Issue Date</span>
                      <span className="vc-field-value">{new Date().toLocaleDateString('en-NG', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="vc-card-footer">
                    <span className="vc-footer-text">IReV Portal · Nigeria</span>
                    <span className="vc-demo-badge">DEMO CARD</span>
                  </div>
                  <div className="vc-disclaimer-strip">
                    This is a simulated voter card for academic demonstration purposes only
                  </div>
                </div>
              </div>

              {/* Info panel */}
              <div className="vc-info">
                <h3 className="vc-info-title">About This Card</h3>
                <div className="vc-info-list">
                  {[
                    { label: 'Full Name', value: user?.fullName },
                    { label: 'Email', value: user?.email },
                    { label: 'VIN', value: vin },
                    { label: 'Status', value: 'Registered' },
                    { label: 'Issue Date', value: new Date().toLocaleDateString() }
                  ].map(item => (
                    <div className="vc-info-item" key={item.label}>
                      <span className="vc-info-label">{item.label}</span>
                      <span className="vc-info-value">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="vc-usage">
                  <h4 className="vc-usage-title">How to use</h4>
                  <p>Click <strong>Print Card</strong> to print directly from your browser, or <strong>Download PDF</strong> to save a copy. Present this card during your project defence to demonstrate the voter registration system.</p>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
