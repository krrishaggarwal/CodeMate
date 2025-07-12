import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/managePosts.css';

const ManagePosts = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?._id) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/user/${user._id}`);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || 'Failed to fetch posts');
        }

        setPosts(result.data || []);
        setMessage({ text: '', type: '' });
      } catch (err) {
        setMessage({ text: err.message, type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="manage-posts-container">
      <h1>Manage Your Posts</h1>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : posts.length === 0 ? (
        <p className="no-posts">You have not created any posts yet.</p>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post._id} className="post-item">
              <div className="post-header">
                <span className="post-date">{formatDate(post.createdAt)}</span>
              </div>

              {post.text && <p className="post-text">{post.text}</p>}

              {post.image && (
                <div className="post-image-container">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="post-image"
                    onClick={() => window.open(post.image, '_blank')}
                  />
                </div>
              )}

              <div className="post-stats">
                <span>❤️ {post.likes?.length || 0} likes</span>
                <span>💬 {post.comments?.length || 0} comments</span>
              </div>

              <div className="post-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-post/${post._id}`)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePosts;
