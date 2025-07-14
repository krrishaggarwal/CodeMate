import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">🚀 CodeMate</Link>
        
        <div 
          className={`menu-toggle ${menuOpen ? 'open' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div></div><div></div><div></div>
        </div>

        <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li><Link to="/explore" onClick={() => setMenuOpen(false)}>Explore</Link></li>
          <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
          <li><Link to="/messages" onClick={() => setMenuOpen(false)}>Messages</Link></li>
          <li><Link to="/settings" onClick={() => setMenuOpen(false)}>Settings</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
