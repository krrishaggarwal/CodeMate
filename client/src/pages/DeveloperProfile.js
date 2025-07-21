import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/DeveloperProfile.css';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

const DeveloperProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState('none');
  const [activeTab, setActiveTab] = useState('about');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [profileStats, setProfileStats] = useState({
    followers: 0,
    following: 0,
    totalPosts: 0
  });

  const isOwnProfile = !userId || userId === currentUser?._id;

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const apiCall = useCallback(async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }, [API_BASE_URL]);

  // Fetch user profile and posts
  const fetchProfile = useCallback(async () => {
    const targetUserId = userId || currentUser?._id;
    if (!targetUserId) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch profile
      const data = await apiCall(`/api/users/${targetUserId}`);
      setProfile(data.user || data);

      // Fetch posts separately
      const postsData = await apiCall(`/api/posts/user/${targetUserId}`);
      setPosts(postsData.posts || postsData || []);

      // Fetch stats
      const stats = await apiCall(`/api/users/stats/${targetUserId}`);
      setProfileStats(stats);

    } catch (error) {
      setError('Failed to load profile. Please try again.');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, currentUser, apiCall]);




  const checkFollowStatus = useCallback(async () => {
    if (!userId || isOwnProfile || !currentUser?._id) return;

    try {
      const data = await apiCall(`/api/follow/status/${userId}?from=${currentUser._id}`);
      setFollowStatus(data.isFollowing ? 'following' : 'none');
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  }, [userId, isOwnProfile, currentUser, apiCall]);

  // Handle follow action
  const handleFollow = async () => {
    console.log('➡️ handleFollow called');
    if (!currentUser || !currentUser._id || !profile || !profile._id || actionLoading) {
      console.warn('❌ Follow aborted', {
        currentUser: currentUser?._id,
        profile: profile?._id,
        actionLoading
      });
      return;
    }

    try {
      setActionLoading(true);
      console.log('📤 Sending follow request:', currentUser._id, '→', profile._id);
      await apiCall('/api/follow/request', {
        method: 'POST',
        body: JSON.stringify({
          fromUserId: currentUser._id,
          toUserId: profile._id
        })
      });
      setFollowStatus('pending');
    } catch (error) {
      setError('Failed to send follow request. Please try again.');
      console.error('❌ API Error:', error);
      console.error('Error sending follow request:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle unfollow action
  const handleUnfollow = async () => {
    if (!profile?._id || actionLoading) return;

    try {
      setActionLoading(true);
      await apiCall('/api/follow/unfollow', {
        method: 'DELETE',
        body: JSON.stringify({ userId: profile._id })
      });
      setFollowStatus('none');
    } catch (error) {
      setError('Failed to unfollow user. Please try again.');
      console.error('Error unfollowing user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle message navigation
  const handleMessage = () => {
    if (!profile?._id) return;
    navigate(`/messages?user=${profile._id}`);
  };

  // Download portfolio
  const downloadPortfolio = async () => {
    if (!profile?._id || actionLoading) return;

    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users/export/${profile._id}`);

      if (!response.ok) {
        throw new Error('Failed to download portfolio');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.name || 'Portfolio'}_Portfolio.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download portfolio. Please try again.');
      console.error('Error downloading portfolio:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown date';
    }
  };

  // Effects
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!isOwnProfile) {
      checkFollowStatus();
    }
  }, [checkFollowStatus, isOwnProfile]);

  // Loading state
  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading" role="status" aria-label="Loading profile">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="profile-container">
        <div className="error" role="alert">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchProfile} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="profile-container">
        <div className="error" role="alert">
          <h2>Profile Not Found</h2>
          <p>The profile you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Error Banner */}
      {error && (
        <div className="error-banner" role="alert">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-info">
            <div className="profile-avatar">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={`${profile.name || 'User'}'s avatar`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="avatar-placeholder" style={{ display: profile.avatar ? 'none' : 'flex' }}>
                {(profile.name || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="profile-details">
              <h1>{profile.name || 'Anonymous User'}</h1>
              <p className="profile-bio">{profile.bio || 'No bio available'}</p>
              <div className="profile-meta">
                {profile.location && (
                  <span className="location">📍 {profile.location}</span>
                )}
                <span>{" "}</span>
                <span className="joined">
                  Joined {formatDate(profile.createdAt)}
                </span>
              </div>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">{profileStats.followers}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{profileStats.following}</span>
                  <span className="stat-label">Following</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{profileStats.totalPosts}</span>
                  <span className="stat-label">Posts</span>
                </div>
              </div>

            </div>
          </div>
          <div className="profile-actions">
            {isOwnProfile ? (
              <button
                onClick={() => navigate('/edit-profile')}
                className="edit-profile-btn"
                disabled={actionLoading}
              >
                Edit Profile
              </button>
            ) : (
              <div className="action-buttons">
                {followStatus === 'none' && (
                  <button
                    onClick={handleFollow}
                    className="follow-btn"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Following...' : 'Follow'}
                  </button>
                )}
                {followStatus === 'pending' && (
                  <button disabled className="pending-btn">
                    Request Sent
                  </button>
                )}
                {followStatus === 'following' && (
                  <button
                    onClick={handleUnfollow}
                    className="unfollow-btn"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Unfollowing...' : 'Unfollow'}
                  </button>
                )}
                <button
                  onClick={handleMessage}
                  className="message-btn"
                  disabled={actionLoading}
                >
                  Message
                </button>
              </div>
            )}
            <button
              onClick={downloadPortfolio}
              className="download-btn"
              disabled={actionLoading}
            >
              {actionLoading ? 'Downloading...' : 'Download Portfolio'}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="profile-nav" role="tablist">
        <button
          className={activeTab === 'about' ? 'active' : ''}
          onClick={() => setActiveTab('about')}
          role="tab"
          aria-selected={activeTab === 'about'}
          aria-controls="about-panel"
        >
          About
        </button>
        <button
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
          role="tab"
          aria-selected={activeTab === 'posts'}
          aria-controls="posts-panel"
        >
          Posts ({posts.length})
        </button>
        <button
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
          role="tab"
          aria-selected={activeTab === 'projects'}
          aria-controls="projects-panel"
        >
          Projects ({profile.projects?.length || 0})
        </button>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {activeTab === 'about' && (
          <div
            className="about-section"
            role="tabpanel"
            id="about-panel"
            aria-labelledby="about-tab"
          >
            <div className="about-grid">
              {/* Skills */}
              <div className="about-card">
                <h3>Skills</h3>
                <div className="skills-list">
                  {profile.skills?.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="no-content">No skills added yet</p>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="about-card">
                <h3>Connect</h3>
                <div className="social-links">
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      aria-label="GitHub profile"
                    >
                      GitHub
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      aria-label="LinkedIn profile"
                    >
                      LinkedIn
                    </a>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      aria-label="Personal website"
                    >
                      Website
                    </a>
                  )}
                  {!profile.github && !profile.linkedin && !profile.website && (
                    <p className="no-content">No social links added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map(post => (
                <PostCard key={post._id} post={post} currentUser={currentUser} />
              ))}
            </div>
          ) : (
            <div className="no-posts">
              <p>{isOwnProfile ? "You haven't posted anything yet." : 'No posts yet.'}</p>
            </div>
          )
        )}



        {activeTab === 'projects' && (
          <div
            className="projects-section"
            role="tabpanel"
            id="projects-panel"
            aria-labelledby="projects-tab"
          >
            {profile.projects?.length > 0 ? (
              <div className="projects-grid">
                {profile.projects.map((project, index) => (
                  <article key={project.id || index} className="project-card">
                    <div className="project-header">
                      <h4>{project.title || 'Untitled Project'}</h4>
                      <div className="project-links">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View project on GitHub"
                          >
                            GitHub
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View live demo"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="project-description">
                      {project.description || 'No description available'}
                    </p>
                    {project.technologies?.length > 0 && (
                      <div className="project-technologies">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="no-projects">
                <p>{isOwnProfile ? 'You haven\'t added any projects yet.' : 'No projects added yet.'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperProfile;