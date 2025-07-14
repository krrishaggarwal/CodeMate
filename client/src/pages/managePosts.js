import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/managePosts.css';

const ManagePosts = () => {
  const { user, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        } else {
          setMessage(data.message || 'Failed to fetch posts');
        }
      } catch (err) {
        setMessage('Error fetching posts.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPosts();
  }, [user, token]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post._id !== postId));
        setMessage('Post deleted successfully.');
      } else {
        setMessage(data.message || 'Failed to delete post');
      }
    } catch (err) {
      setMessage('Network error while deleting.');
    }
  };

  return (
    <div className="manage-posts-container">
      <h1>Manage Your Posts</h1>
      {message && <p className="message">{message}</p>}
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>You have not posted anything yet.</p>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post._id} className="post-item">
              <h3>{post.title || 'Untitled Post'}</h3>
              {post.imageUrl && <img src={post.imageUrl} alt="Post visual" className="post-img" />}
              <p>{post.content}</p>
              <div className="post-actions">
                <button onClick={() => navigate(`/edit-post/${post._id}`)}>Edit</button>
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePosts;
