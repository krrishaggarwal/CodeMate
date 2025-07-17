import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/NavBar.css';
import logo from '../assets/logo.svg';
import logo_light from '../assets/logo_light.svg';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useContext(AuthContext); // Get theme from context

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <img
            src={theme === 'dark' ? logo_light : logo}
            alt="CodeMate"
            className="navbar-logo-img"
          />
        </Link>

        {/* Hamburger */}
        <div
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Nav Links */}
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
