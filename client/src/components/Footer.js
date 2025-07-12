import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__left">
        <h2 className="footer__logo">CodeMate</h2>
        <p>Connecting developers worldwide 🌍</p>
      </div>

      <div className="footer__links">
        <Link to="/explore">Explore</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/settings">Settings</Link>
      </div>

      <div className="footer__bottom">
        <p>© 2025 CodeMate. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
