// Feed page - displays posts from followed users
import React, { useState, useEffect } from 'react';
import { getFeed, deletePost, createPost } from '../services/api';
import { auth } from '../services/firebase';
import Post from '../components/Post';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const feedPosts = await getFeed();
      setPosts(feedPosts);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        setPosts(posts.filter((p) => p.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    try {
      const postData = await createPost(newPostContent, newPostImage);
      // add author metadata so Post component can render immediately
      const authorInfo = {
        name: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User',
        avatar: currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || currentUser?.email)}&background=random`,
      };
      const augmented = { ...postData, author: authorInfo };
      // prepend to feed
      setPosts((prev) => [augmented, ...prev]);
      setNewPostContent('');
      setNewPostImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPostImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="loading">Loading feed...</div>;
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>Feed</h1>
        <button onClick={loadFeed} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {currentUser && (
        <div className="new-post-form">
          <textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={3}
            className="new-post-input"
          />
          <div className="new-post-controls">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleCreatePost} className="submit-post-btn">
              Post
            </button>
          </div>
          {newPostImage && (
            <div className="image-preview">
              <img src={newPostImage} alt="preview" />
            </div>
          )}
        </div>
      )}

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet. Follow users to see their posts!</p>
          </div>
        ) : (
          posts.map((post) => <Post key={post.id} post={post} onDelete={handleDeletePost} />)
        )}
      </div>
    </div>
  );
};

export default Feed;
