import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Setting.css';

const Settings = () => {
  const { user, token, logout, toggleTheme, theme } = useContext(AuthContext);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account permanently?'
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/delete`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setDeleteMessage('Account deleted successfully.');
        logout(); // Logs out and clears user data
      } else {
        setDeleteMessage(data.message || 'Failed to delete account.');
      }
    } catch {
      setDeleteMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1>Account Settings</h1>

      {/* Theme Toggle */}
      <div className="theme-toggle">
        <p>
          Current Theme:{' '}
          <strong>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong>
        </p>
        <button onClick={toggleTheme} className="theme-btn">
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {/* Account Deletion */}
      <div className="account-section">
        <h3>Delete Account</h3>
        <p>
          This action is irreversible. All your data including posts and
          messages will be permanently deleted.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="delete-btn"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete My Account'}
        </button>
        {deleteMessage && <p className="message">{deleteMessage}</p>}
      </div>

      {/* Logout */}
      <div className="logout-section">
        <h3>Log Out</h3>
        <button onClick={logout} className="logout-btn">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Settings;