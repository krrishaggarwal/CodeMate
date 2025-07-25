import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigate
import '../styles/PostCard.css';

const PostCard = ({ post, currentUser }) => {
  const [localPost, setLocalPost] = useState(post);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const navigate = useNavigate(); // ✅ Init navigate

  if (!post || !currentUser || !post.user) return null;

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const isLikedByUser = localPost.likes?.includes(currentUser._id);

  const handleLike = async () => {
    try {
      setLikeAnimating(true);

      const res = await fetch(`${API_BASE_URL}/api/posts/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: localPost._id,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();
      if (data.data) setLocalPost(data.data);

      setTimeout(() => setLikeAnimating(false), 300);
    } catch (err) {
      alert('Failed to like the post');
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: localPost._id,
          userId: currentUser._id,
          text: comment,
        }),
      });

      const data = await res.json();
      if (data.data) {
        setLocalPost(data.data);
        setComment('');
        setShowCommentBox(false);
        setShowAllComments(true);
      }
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  return (
    <div className="post-card">
      {/* 👇 Clickable Avatar & Header */}
      <div
        className="post-card-header"
        onClick={() => navigate(`/developer/${localPost.user._id}`)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={localPost.user?.avatar || '/default-avatar.png'}
          alt="Avatar"
          className="post-avatar"
        />
        <div className="post-user-details">
          <div className="post-username">{localPost.user?.name || 'Unknown'}</div>
          <div className="post-meta-line">
            <div className="post-bio">{localPost.user?.bio || 'No bio available'}</div>
            <div className="post-date">{new Date(localPost.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {localPost.image && (
        <div className="post-card-image">
          <img src={localPost.image} alt="Post" />
        </div>
      )}

      <div className="post-snippet">
        <strong>{localPost.text || 'No content available.'}</strong>
      </div>

      <div className="post-card-content">
        <div className="post-stats">
          <span>{localPost.likes?.length || 0} Likes</span>
          <span>{localPost.comments?.length || 0} Comments</span>
        </div>

        <div className="post-buttons-row">
          <button
            onClick={handleLike}
            className={`like-btn ${isLikedByUser ? 'liked' : ''} ${likeAnimating ? 'animated' : ''}`}
          >
            {isLikedByUser ? '❤️ Liked' : '🤍 Like'}
          </button>
          <button
            onClick={() => setShowCommentBox(prev => !prev)}
            className="comment-toggle-btn"
          >
            💬 Comment
          </button>
        </div>
      </div>

      <div className="comment-section">
        {showCommentBox && (
          <div className="comment-input-area">
            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="comment-input"
            />
            <button onClick={handleComment} className="send-comment-btn">
              Send
            </button>
          </div>
        )}

        <h4>Recent Comments</h4>
        <ul className="comments-list">
          {(showAllComments ? localPost.comments : localPost.comments?.slice(0, 3))?.map((c, i) => (
            <li className="comment" key={i}>
              <strong>{c.user?.name || 'User'}:</strong> {c.text}
            </li>
          ))}
        </ul>

        {localPost.comments?.length > 3 && (
          <button
            className="view-all-comments-btn"
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? 'Show Less' : 'View All Comments'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
