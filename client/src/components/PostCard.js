import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PostCard.css';

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div className="post-card">
      {post.imageUrl && (
        <div className="post-card-image">
          <img src={post.imageUrl} alt={post.title || "Post"} />
        </div>
      )}

      <div className="post-card-content">
        <h3>{post.title || 'Untitled Post'}</h3>
        <p className="post-snippet">
          {post.content.length > 100 
            ? `${post.content.substring(0, 100)}...`
            : post.content}
        </p>

        <div className="post-meta">
          <span>By {post.author?.name || 'Unknown'}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <button onClick={() => navigate(`/post/${post._id}`)} className="view-post-btn">
          Read More
        </button>
      </div>
    </div>
  );
};

export default PostCard;
