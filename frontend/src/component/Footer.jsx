import React from 'react'

export default function Footer() {
  return (
 <footer>
  <div className="footer-content">
    <p>&copy; 2026 Personal Finance Tracker | All Data Encrypted</p>
    <nav>
      <a href="#export">Export CSV</a> | 
      <a href="#privacy">Privacy Policy</a> | 
      <a href="#support">Support</a>
    </nav>
    <div className="status-indicator">
      <span>Sync Status: 🟢 Cloud Updated</span>
    </div>
  </div>
</footer>
  )
}
