import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import '../styles/Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('trending'); // 'trending' or 'following'

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'trending' ? '/api/posts/trending' : '/api/posts/following';
      const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to load posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPosts(prev =>
          prev.map(post =>
            post._id === postId
              ? { ...post, likes: post.likes + 1, isLiked: true }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setPosts(prev =>
          prev.map(post =>
            post._id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome back, {user?.name}!</h1>
        <div className="filter-tabs">
          <button
            className={filter === 'trending' ? 'active' : ''}
            onClick={() => setFilter('trending')}
          >
            Trending Posts
          </button>
          <button
            className={filter === 'following' ? 'active' : ''}
            onClick={() => setFilter('following')}
          >
            Following
          </button>
        </div>
      </div>

      <div className="posts-feed">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts to show. Start following developers to see their posts!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
