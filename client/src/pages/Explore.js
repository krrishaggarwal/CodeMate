import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Explore.css';

const Explore = () => {
  const [developers, setDevelopers] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/all`);
        const data = await res.json();
        if (res.ok) {
          setDevelopers(data.users);
          setFiltered(data.users);
        } else {
          setMessage(data.message || 'Failed to load developers.');
        }
      } catch (error) {
        setMessage('Network error. Please try again later.');
      }
    };

    fetchDevelopers();
  }, []);

  useEffect(() => {
    const filteredList = developers.filter(dev =>
      dev.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredList);
  }, [search, developers]);

  return (
    <div className="explore-container">
      <h1>Explore Developers</h1>

      {message && <p className="message">{message}</p>}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search developers by name..."
        className="search-bar"
      />

      {filtered.length === 0 ? (
        <p>No developers found.</p>
      ) : (
        <div className="developer-grid">
          {filtered.map((dev) => (
            <div key={dev._id} className="developer-card">
              <h3>{dev.name}</h3>
              <p>{dev.bio?.substring(0, 80)}...</p>
              <p className="dev-skills">{dev.skills?.join(', ')}</p>
              <button onClick={() => navigate(`/developer/${dev._id}`)}>
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
