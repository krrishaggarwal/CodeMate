import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Explore.css';

const Explore = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [search] = useState(initialSearch); // Static from URL
  const [developers, setDevelopers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/search?keyword=${search}`);
        const data = await res.json();
        if (res.ok) {
          setDevelopers(data);
        } else {
          setMessage(data.message || 'Failed to load developers.');
        }
      } catch (error) {
        setMessage('Network error. Please try again later.');
      }
    };

    if (search.trim()) {
      fetchDevelopers();
    } else {
      setDevelopers([]);
    }
  }, [search]);

  return (
    <div className="explore-container">
      <h1>Explore Developers</h1>

      {message && <p className="message">{message}</p>}

      {developers.length === 0 ? (
        <p>No developers found.</p>
      ) : (
        <div className="developer-grid">
          {developers.map((dev) => (
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
