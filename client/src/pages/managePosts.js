import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/managePosts.css';

const ManagePosts = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [commentInputs, setCommentInputs] = useState({});

  const fetchPosts = async () => {
    if (!user?.userId) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/posts/user/${user.userId}`);
      const data = await res.json();
      setPosts(res.ok ? data : []);
    } catch (err) {
      setMessage('Error fetching posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          text: newPostText,
          image: newPostImage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPosts([data, ...posts]);
        setNewPostText('');
        setNewPostImage('');
        setMessage('✅ Post added');
      } else {
        setMessage(data.error || '❌ Failed to add post.');
      }
    } catch {
      setMessage('❌ Error adding post.');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setPosts(posts.filter(p => p._id !== postId));
        setMessage('🗑️ Post deleted');
      } else {
        setMessage(data.error || '❌ Failed to delete.');
      }
    } catch {
      setMessage('❌ Error deleting post.');
    }
  };

  const handleLike = async (postId, liked) => {
    const url = liked
      ? 'http://localhost:5000/api/posts/unlike'
      : 'http://localhost:5000/api/posts/like';

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId: user.userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setPosts(posts.map(p => (p._id === postId ? data : p)));
      }
    } catch {
      console.error('❌ Like/unlike failed.');
    }
  };

  const handleComment = async (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    try {
      const res = await fetch('http://localhost:5000/api/posts/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId: user.userId, text: commentText }),
      });

      const data = await res.json();
      if (res.ok) {
        setPosts(posts.map(p => (p._id === postId ? data : p)));
        setCommentInputs({ ...commentInputs, [postId]: '' });
      }
    } catch {
      console.error('❌ Comment error');
    }
  };

  return (
    <div className="manage-posts-container">
      <h2>Manage Your Posts</h2>
      {message && <p className="message">{message}</p>}

      <form className="add-post-form" onSubmit={handleAddPost}>
        <textarea
          placeholder="What's on your mind?"
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          maxLength={500}
          required
        />
        <input
          type="text"
          placeholder="Optional image URL"
          value={newPostImage}
          onChange={(e) => setNewPostImage(e.target.value)}
        />
        <button type="submit">Add Post</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="posts-list">
          {posts.map((post) => {
            const isLiked = post.likes?.includes(user.userId);
            return (
              <div key={post._id} className="post-item">
                <h3>{post.text || 'No content...'}</h3>
                {post.image && (
                  <img src={post.image} alt="Post" className="post-img" />
                )}
                <p>Likes: {post.likes.length}</p>

                <div className="post-actions">
                  <button onClick={() => handleLike(post._id, isLiked)}>
                    {isLiked ? 'Unlike' : 'Like'}
                  </button>
                  <button onClick={() => handleDeletePost(post._id)}>
                    Delete
                  </button>
                </div>

                <div className="comments">
                  <h4>Comments</h4>
                  {post.comments.map((c, i) => (
                    <p key={i}>
                      <strong>{c.user?.name || 'User'}:</strong> {c.text}
                    </p>
                  ))}
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post._id] || ''}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post._id]: e.target.value })
                    }
                  />
                  <button onClick={() => handleComment(post._id)}>Comment</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManagePosts;
