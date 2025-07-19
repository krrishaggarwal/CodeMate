import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPosts: 0,
    followers: 0,
    following: 0,
    profileViews: 0
  });
  const [followRequests, setFollowRequests] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const promises = [];

        // Fetch stats
        promises.push(
          fetch(`${API_BASE_URL}/api/users/stats/${user.userId}`)
            .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch stats'))
            .then(data => setStats(data))
            .catch(err => console.error('Error fetching stats:', err))
        );

        // Fetch follow requests
        promises.push(
          fetch(`${API_BASE_URL}/api/follow/requests/${user.userId}`)
            .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch requests'))
            .then(data => setFollowRequests(data))
            .catch(err => console.error('Error fetching follow requests:', err))
        );

        // Fetch recent posts
        promises.push(
          fetch(`${API_BASE_URL}/api/posts/user/${user.userId}`)
            .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch posts'))
            .then(data => setRecentPosts(data.slice(0, 5)))
            .catch(err => console.error('Error fetching posts:', err))
        );

        await Promise.allSettled(promises);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate, API_BASE_URL]);

  const handleFollowRequest = async (requestId, action) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/follow/respond`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          userId: user.userId,
          status: action === 'accept' ? 'accepted' : 'rejected'
        })
      });

      if (res.ok) {
        setFollowRequests(prev => prev.filter(req => req._id !== requestId));
        if (action === 'accept') {
          setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
        }
      } else {
        console.error('Failed to handle follow request');
      }
    } catch (err) {
      console.error('Error handling follow request:', err);
    }
  };

  const downloadPortfolio = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/export/${user.userId}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user.name || 'Portfolio'}_Portfolio.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download portfolio');
      }
    } catch (err) {
      console.error('Error downloading portfolio:', err);
    }
  };

  if (loading) {
    return <div className="dashboard-container"><div className="loading">Loading Profile...</div></div>;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">{error}<button onClick={() => window.location.reload()}>Retry</button></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header"><h1>My Profile</h1></div>

      <div className="dashboard-grid modern-layout">
        {/* LEFT COLUMN */}
        <div className="left-column">
          <div className="dashboard-card profile-overview">
            <div className="card-header">
              <h3>Profile Overview</h3>
              <Link to="/edit-profile" className="edit-link">Edit</Link>
            </div>
            <div className="profile-info">
              <div className="profile-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name || 'User'} />
                ) : (
                  <div className="avatar-placeholder">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                )}
              </div>
              <div className="profile-details">
                <h4>{user.name || 'Unknown User'}</h4>
                <p>{user.email || 'No email provided'}</p>
                <p className="bio">{user.bio || 'No bio added yet'}</p>
                <div className="skills">
                  {user.skills?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                  {user.skills?.length > 3 && (
                    <span className="skill-tag">+{user.skills.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button onClick={() => navigate('/manage-posts')} className="action-btn">Manage Posts</button>
              <button onClick={() => navigate('/explore')} className="action-btn">Explore Developers</button>
              <button onClick={downloadPortfolio} className="action-btn">Download Portfolio</button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">
          <div className="dashboard-card stats-card">
            <h3>Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item"><div className="stat-number">{stats.followers}</div><div className="stat-label">Followers</div></div>
              <div className="stat-item"><div className="stat-number">{stats.following}</div><div className="stat-label">Following</div></div>
              <div className="stat-item"><div className="stat-number">{stats.totalPosts}</div><div className="stat-label">Posts</div></div>
              <div className="stat-item"><div className="stat-number">{stats.profileViews}</div><div className="stat-label">Views</div></div>
            </div>
          </div>

          {followRequests.length > 0 && (
            <div className="dashboard-card follow-requests">
              <h3>Follow Requests ({followRequests.length})</h3>
              <div className="requests-list">
                {followRequests.slice(0, 3).map(req => (
                  <div key={req._id} className="request-item">
                    <div className="request-info">
                      <div className="request-avatar">
                        {req.requester?.avatar ? (
                          <img src={req.requester.avatar} alt={req.requester.name || 'User'} />
                        ) : (
                          <div className="avatar-placeholder">
                            {req.requester?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="request-name">{req.requester?.name || 'Unknown'}</div>
                        <div className="request-email">{req.requester?.email || 'No email'}</div>
                      </div>
                    </div>
                    <div className="request-actions">
                      <button onClick={() => handleFollowRequest(req._id, 'accept')} className="accept-btn">Accept</button>
                      <button onClick={() => handleFollowRequest(req._id, 'decline')} className="decline-btn">Decline</button>
                    </div>
                  </div>
                ))}
                {followRequests.length > 3 && (
                  <Link to="/follow-requests" className="view-all-link">View all requests</Link>
                )}
              </div>
            </div>
          )}

          <div className="dashboard-card recent-posts">
            <div className="card-header">
              <h3>Recent Posts</h3>
              <Link to="/manage-posts" className="view-all-link">Manage All</Link>
            </div>
            <div className="posts-list">
              {recentPosts.length === 0 ? (
                <p className="no-posts">No posts yet.</p>
              ) : (
                recentPosts.map(post => (
                  <div key={post._id} className="post-item">
                    <p>{post.text?.substring(0, 100) || 'No content'}...</p>
                    <div className="post-meta">
                      {new Date(post.createdAt).toLocaleDateString()} • {post.likes?.length || 0} likes • {post.comments?.length || 0} comments
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
