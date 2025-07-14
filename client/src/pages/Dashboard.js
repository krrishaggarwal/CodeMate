import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPosts: 0,
    followers: 0,
    following: 0,
    profileViews: 0
  });
  const [followRequests, setFollowRequests] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user stats
      const statsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch follow requests
      const requestsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/follow/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setFollowRequests(requestsData);
      }

      // Fetch recent posts
      const postsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/user/recent`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setRecentPosts(postsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowRequest = async (requestId, action) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/follow/request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        setFollowRequests(followRequests.filter(req => req._id !== requestId));
        // Update stats if accepted
        if (action === 'accept') {
          setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
        }
      }
    } catch (error) {
      console.error('Error handling follow request:', error);
    }
  };

  const downloadPortfolio = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/portfolio/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user.name}_Portfolio.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading portfolio:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-actions">
          <button onClick={downloadPortfolio} className="download-btn">
            Download Portfolio
          </button>
          <Link to="/settings" className="settings-btn">
            Settings
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Profile Overview */}
        <div className="dashboard-card profile-overview">
          <div className="card-header">
            <h3>Profile Overview</h3>
            <Link to="/edit-profile" className="edit-link">Edit Profile</Link>
          </div>
          <div className="profile-info">
            <div className="profile-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile-details">
              <h4>{user?.name}</h4>
              <p>{user?.email}</p>
              <p className="bio">{user?.bio || 'No bio added yet'}</p>
              <div className="skills">
                {user?.skills?.slice(0, 3).map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
                {user?.skills?.length > 3 && (
                  <span className="skill-tag">+{user.skills.length - 3} more</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="dashboard-card stats-card">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.totalPosts}</div>
              <div className="stat-label">Posts</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.followers}</div>
              <div className="stat-label">Followers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.following}</div>
              <div className="stat-label">Following</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.profileViews}</div>
              <div className="stat-label">Profile Views</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/manage-posts" className="action-btn">
              Manage Posts
            </Link>
            <Link to="/explore" className="action-btn">
              Explore Developers
            </Link>
            <Link to="/messages" className="action-btn">
              Messages
            </Link>
            <Link to="/developer-profile" className="action-btn">
              View My Profile
            </Link>
          </div>
        </div>

        {/* Follow Requests */}
        {followRequests.length > 0 && (
          <div className="dashboard-card follow-requests">
            <h3>Follow Requests ({followRequests.length})</h3>
            <div className="requests-list">
              {followRequests.slice(0, 3).map(request => (
                <div key={request._id} className="request-item">
                  <div className="request-info">
                    <div className="request-avatar">
                      {request.requester?.avatar ? (
                        <img src={request.requester.avatar} alt={request.requester.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {request.requester?.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="request-name">{request.requester?.name}</div>
                      <div className="request-email">{request.requester?.email}</div>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button 
                      onClick={() => handleFollowRequest(request._id, 'accept')}
                      className="accept-btn"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleFollowRequest(request._id, 'decline')}
                      className="decline-btn"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
              {followRequests.length > 3 && (
                <Link to="/follow-requests" className="view-all-link">
                  View all requests
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Recent Posts */}
        <div className="dashboard-card recent-posts">
          <div className="card-header">
            <h3>Recent Posts</h3>
            <Link to="/manage-posts" className="view-all-link">Manage All</Link>
          </div>
          <div className="posts-list">
            {recentPosts.length === 0 ? (
              <p className="no-posts">No posts yet. <Link to="/manage-posts">Create your first post!</Link></p>
            ) : (
              recentPosts.map(post => (
                <div key={post._id} className="post-item">
                  <div className="post-content">
                    <p>{post.content.substring(0, 100)}...</p>
                    <div className="post-meta">
                      <span className="post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="post-stats">
                        {post.likes || 0} likes • {post.comments?.length || 0} comments
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;