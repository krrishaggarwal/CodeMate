import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalPosts: 0, followers: 0, following: 0, profileViews: 0 });
  const [followRequests, setFollowRequests] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching dashboard for:', user._id);

        // Fetch user data
        const statsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (statsRes.status === 401) {
          logout();
          navigate('/login');
          return;
        }

        if (!statsRes.ok) throw new Error('Failed to fetch user stats');
        const userData = await statsRes.json();

        // Fetch user's posts
        const postsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!postsRes.ok) throw new Error('Failed to fetch posts');
        const postsData = await postsRes.json();

        setStats({
          totalPosts: postsData.data?.length || 0,
          followers: userData.followers?.length || 0,
          following: userData.following?.length || 0,
          profileViews: userData.profileViews || 0,
        });

        // Fetch follow requests
        const requestsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/follow/requests/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!requestsRes.ok) throw new Error('Failed to fetch follow requests');
        const requestsData = await requestsRes.json();

        setFollowRequests(requestsData.data || []);
        setRecentPosts(postsData.data?.slice(0, 3) || []);

      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, token, logout, navigate]);

  const handleFollowRequest = async (requestId, action) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/follow/respond`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          userId: user._id,
          status: action === 'accept' ? 'accepted' : 'declined',
        }),
      });

      if (!response.ok) throw new Error('Failed to process follow request');

      setFollowRequests(prev => prev.filter(req => req._id !== requestId));
      if (action === 'accept') {
        setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const downloadPortfolio = () => {
    window.open(`${process.env.REACT_APP_API_URL}/api/users/export/${user._id}`, '_blank');
  };

  if (loading || !user?._id) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <div className="dashboard-actions">
          <button onClick={downloadPortfolio} className="download-btn">Export Profile</button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Stats Card */}
      <div className="dashboard-card stats-card">
        <h3>Your Stats</h3>
        <div className="stats-grid">
          <div className="stat-item"><div className="stat-number">{stats.totalPosts}</div><div className="stat-label">Posts</div></div>
          <div className="stat-item"><div className="stat-number">{stats.followers}</div><div className="stat-label">Followers</div></div>
          <div className="stat-item"><div className="stat-number">{stats.following}</div><div className="stat-label">Following</div></div>
          <div className="stat-item"><div className="stat-number">{stats.profileViews}</div><div className="stat-label">Profile Views</div></div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="dashboard-card recent-posts">
        <h3>Recent Posts</h3>
        {recentPosts.length === 0 ? (
          <p>No posts yet. <Link to="/create-post">Create your first post!</Link></p>
        ) : (
          recentPosts.map(post => (
            <div key={post._id} className="post-item">
              {post.image && <img src={post.image} alt="Post" className="post-image" />}
              <p>{post.text}</p>
              <small>{new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>

      {/* Follow Requests */}
      {followRequests.length > 0 && (
        <div className="dashboard-card follow-requests">
          <h3>Follow Requests</h3>
          {followRequests.map(req => (
            <div key={req._id} className="request-item">
              <p>{req.from.name} ({req.from.email})</p>
              <button onClick={() => handleFollowRequest(req._id, 'accept')}>Accept</button>
              <button onClick={() => handleFollowRequest(req._id, 'decline')}>Decline</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
