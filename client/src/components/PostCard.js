import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PostCard.css';

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div className="post-card">
      {post.image && (
        <div className="post-card-image">
          <img src={post.image} alt="Post" />
        </div>
      )}

      <div className="post-card-content">
        <h3>{post.text?.substring(0, 40) || 'Untitled Post'}</h3>

        <p className="post-snippet">
          {post.text?.length > 100
            ? `${post.text.substring(0, 100)}...`
            : post.text}
        </p>

        <div className="post-meta">
          <span>By {post.user?.name || 'Unknown'}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="post-stats">
          <span>{post.likes?.length || 0} Likes</span>
          <span>{post.comments?.length || 0} Comments</span>
        </div>

        <button
          onClick={() => navigate(`/post/${post._id}`)}
          className="view-post-btn"
        >
          Read More
        </button>
      </div>
    </div>
  );
};

export default PostCard;
