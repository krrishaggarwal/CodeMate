import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // ✅ Import AuthContext
import '../styles/Explore.css';

const Explore = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext); // ✅ Use context properly

  const [search, setSearch] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Update search keyword from URL whenever it changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('search') || '';
    setSearch(keyword);
  }, [location.search]);

  // Fetch developers (all or filtered)
  useEffect(() => {
    const fetchDevelopers = async () => {
      setLoading(true);
      try {
        const endpoint = search.trim()
          ? `http://localhost:5000/api/users/search?keyword=${search}`
          : `http://localhost:5000/api/users`;

        const res = await fetch(endpoint);
        const data = await res.json();

        if (res.ok) {
          setDevelopers(data);
          setMessage('');
        } else {
          setDevelopers([]);
          setMessage(data.message || 'Failed to load developers.');
        }
      } catch (error) {
        setDevelopers([]);
        setMessage('Network error. Please try again later.');
      }
      setLoading(false);
    };

    fetchDevelopers();
  }, [search]);

  return (
    <div className="explore-container">
      <h1>Explore Developers</h1>

      {loading ? (
        <p>Loading developers...</p>
      ) : message ? (
        <p className="message">{message}</p>
      ) : developers.filter(dev => dev._id !== currentUser?._id).length === 0 ? (
        <p>No developers found.</p>
      ) : (
        <div className="developer-grid">
          {developers
            .filter(dev => dev._id !== currentUser?._id) // ✅ Exclude self
            .map((dev) => (
              <div key={dev._id} className="developer-card">
                <h3>{dev.name}</h3>
                <p>{dev.bio?.substring(0, 80) || 'No bio available.'}...</p>
                <p className="dev-skills">{dev.skills?.join(', ') || 'No skills listed.'}</p>
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
