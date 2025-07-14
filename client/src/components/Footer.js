import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__left">
        <h2 className="footer__logo">CodeMate</h2>
        <p>Connecting developers worldwide 🌍</p>
      </div>

      <div className="footer__links">
        <a href="/explore">Explore</a>
        <a href="/messages">Messages</a>
        <a href="/settings">Settings</a>
      </div>

      <div className="footer__bottom">
        <p>© 2025 CodeMate. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

