import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="https://www.inecnigeria.org/wp-content/uploads/2019/07/inec-logo.png"
               alt="INEC" onError={e=>{e.target.src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%231a7a3c' stroke='%23fff' stroke-width='2'/%3E%3Ctext x='50' y='45' text-anchor='middle' fill='white' font-size='18' font-weight='bold' font-family='Arial'%3EINEC%3C/text%3E%3Ctext x='50' y='65' text-anchor='middle' fill='%2386efac' font-size='8' font-family='Arial'%3ENigeria%3C/text%3E%3C/svg%3E";}} />
          <p>Nigeria's Independent National Electoral Commission digital result dissemination platform. Real-time, transparent, accessible.</p>
        </div>
        <div className="footer-col">
          <h6>Quick Links</h6>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/results">Results</Link></li>
            <li><Link to="/about">About INEC</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h6>Elections</h6>
          <ul>
            <li><a href="#">Presidential</a></li>
            <li><a href="#">Gubernatorial</a></li>
            <li><a href="#">Senatorial</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h6>Contact</h6>
          <ul>
            <li><a href="https://www.inecnigeria.org" target="_blank">Official Website</a></li>
            <li><a href="#">Help Centre</a></li>
            <li><a href="#">Report Issue</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} INEC Result Portal. All rights reserved.</span>
        <span>Designed for <span className="green">Nigeria's Democracy</span></span>
      </div>
    </footer>
  );
}