import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/DeveloperProfile.css';

const DeveloperProfile = () => {
  const { userId } = useParams();
  const { user: currentUser, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followStatus, setFollowStatus] = useState('none'); // 'none', 'following', 'pending'
  const [activeTab, setActiveTab] = useState('about');
  const navigate = useNavigate();

  const isOwnProfile = !userId || userId === currentUser?._id;

  useEffect(() => {
    fetchProfile();
    if (!isOwnProfile) {
      checkFollowStatus();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const targetUserId = userId || currentUser._id;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/${targetUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/follow/status/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFollowStatus(data.status);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/follow/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: profile._id })
      });

      if (response.ok) {
        setFollowStatus('pending');
      }
    } catch (error) {
      console.error('Error sending follow request:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/follow/unfollow`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: profile._id })
      });

      if (response.ok) {
        setFollowStatus('none');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleMessage = () => {
    navigate(`/messages?user=${profile._id}`);
  };

  const downloadPortfolio = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/portfolio/download/${profile._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${profile.name}_Portfolio.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading portfolio:', error);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="error">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-info">
            <div className="profile-avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} />
              ) : (
                <div className="avatar-placeholder">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile-details">
              <h1>{profile.name}</h1>
              <p className="profile-bio">{profile.bio || 'No bio available'}</p>
              <div className="profile-meta">
                {profile.location && (
                  <span className="location">📍 {profile.location}</span>
                )}
                <span className="joined">
                  Joined {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">{profile.followersCount || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{profile.followingCount || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{posts.length}</span>
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
              >
                Edit Profile
              </button>
            ) : (
              <div className="action-buttons">
                {followStatus === 'none' && (
                  <button onClick={handleFollow} className="follow-btn">
                    Follow
                  </button>
                )}
                {followStatus === 'pending' && (
                  <button disabled className="pending-btn">
                    Request Sent
                  </button>
                )}
                {followStatus === 'following' && (
                  <button onClick={handleUnfollow} className="unfollow-btn">
                    Unfollow
                  </button>
                )}
                <button onClick={handleMessage} className="message-btn">
                  Message
                </button>
              </div>
            )}
            <button onClick={downloadPortfolio} className="download-btn">
              Download Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="profile-nav">
        <button 
          className={activeTab === 'about' ? 'active' : ''}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button 
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          Posts ({posts.length})
        </button>
        <button 
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          Projects ({profile.projects?.length || 0})
        </button>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {activeTab === 'about' && (
          <div className="about-section">
            <div className="about-grid">
              {/* Skills */}
              <div className="about-card">
                <h3>Skills</h3>
                <div className="skills-list">
                  {profile.skills?.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
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
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="social-link">
                      GitHub
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                      LinkedIn
                    </a>
                  )}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="social-link">
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
          <div className="posts-section">
            {posts.length > 0 ? (
              <div className="posts-grid">
                {posts.map(post => (
                  <div key={post._id} className="post-card">
                    <div className="post-content">
                      <p>{post.content}</p>
                      {post.image && (
                        <img src={post.image} alt="Post" className="post-image" />
                      )}
                    </div>
                    <div className="post-meta">
                      <span className="post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <div className="post-stats">
                        <span>{post.likes || 0} likes</span>
                        <span>{post.comments?.length || 0} comments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-posts">
                <p>{isOwnProfile ? 'You haven\'t posted anything yet.' : 'No posts yet.'}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-section">
            {profile.projects?.length > 0 ? (
              <div className="projects-grid">
                {profile.projects.map((project, index) => (
                  <div key={project.id || index} className="project-card">
                    <div className="project-header">
                      <h4>{project.title}</h4>
                      <div className="project-links">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            GitHub
                          </a>
                        )}
                        {project.live && (
                          <a href={project.live} target="_blank" rel="noopener noreferrer">
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="project-description">{project.description}</p>
                    <div className="project-technologies">
                      {project.technologies?.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
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