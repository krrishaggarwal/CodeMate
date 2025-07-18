import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/NavBar.css';
import logo from '../assets/logo.svg';
import logo_light from '../assets/logo_light.svg';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { theme } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchInput)}`);
      setMenuOpen(false);
      setSearchInput('');
    }
  };

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

        {/* 🔍 Search Bar */}
        <form onSubmit={handleSearch} className="navbar-search-form">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search developers..."
            className="navbar-search-input"
          />
        </form>

        {/* ☰ Hamburger */}
        <div
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* 🔗 Nav Links */}
        <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
          <li><Link to="/messages" onClick={() => setMenuOpen(false)}>Messages</Link></li>
          <li><Link to="/settings" onClick={() => setMenuOpen(false)}>Settings</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
