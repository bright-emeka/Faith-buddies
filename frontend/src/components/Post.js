// Post component - displays individual post with interactions
import React, { useState, useEffect } from 'react';
import { toggleLike, checkLiked, toggleFollow, checkFollowing, getComments, addComment, deleteComment } from '../services/api';
import { auth } from '../services/firebase';

const Post = ({ post, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [localCommentsCount, setLocalCommentsCount] = useState(post.commentsCount || 0);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const checkStatus = async () => {
      if (currentUser && currentUser.uid !== post.userId) {
        try {
          const likeStatus = await checkLiked(post.id);
          setLiked(likeStatus.liked);

          const followStatus = await checkFollowing(post.userId);
          setFollowing(followStatus.following);
        } catch (error) {
          console.error('Error checking post status:', error);
        }
      }
    };

    checkStatus();
  }, [post.id, post.userId, currentUser]);

  const handleLike = async () => {
    try {
      const result = await toggleLike(post.id);
      setLiked(result.liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFollow = async () => {
    try {
      const result = await toggleFollow(post.userId);
      setFollowing(result.following);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const data = await getComments(post.id);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    try {
      const newC = await addComment(post.id, commentInput);
      setComments((prev) => [newC, ...prev]);
      setCommentInput('');
      setLocalCommentsCount((c) => c + 1);
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(post.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setLocalCommentsCount((c) => Math.max(0, c - 1));
  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author-info">
          <img src={post.author?.avatar} alt="avatar" className="post-avatar" />
          <div>
            <h4>{post.author?.name || 'User'}</h4>
            <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        {currentUser && currentUser.uid !== post.userId && (
          <button className={`follow-btn ${following ? 'following' : ''}`} onClick={handleFollow}>
            {following ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      <div className="post-content">{post.content}</div>

      {post.image && <img src={post.image} alt="post" className="post-image" />}

      <div className="post-stats">
        <span>{post.likesCount || 0} likes</span>
        <span>{localCommentsCount} comments</span>
      </div>

      <div className="post-actions">
        <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
          ❤️ Like
        </button>
        <button className="action-btn" onClick={() => {
            setShowComments((s) => !s);
            if (!showComments) loadComments();
          }}
        >
          💬 Comment
        </button>
        <button className="action-btn">↗️ Share</button>
        {currentUser && currentUser.uid === post.userId && (
          <button className="action-btn delete-btn" onClick={() => onDelete(post.id)}>
            🗑️ Delete
          </button>
        )}
      </div>

      {showComments && (
        <div className="post-comments">
          {commentsLoading && <p>Loading comments...</p>}
          {!commentsLoading && (
            <>
              <div className="comments-list">
                {comments.length === 0 && <p>No comments yet</p>}
                {comments.map((c) => (
                  <div key={c.id} className="comment">
                    <img src={c.author?.avatar} alt="avatar" className="comment-avatar" />
                    <div className="comment-body">
                      <div className="comment-header">
                        <strong>{c.author?.name || 'User'}</strong>
                        <span className="comment-date">
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="comment-content">{c.content}</p>
                      {currentUser && currentUser.uid === c.userId && (
                        <button
                          className="comment-delete-btn"
                          onClick={() => handleDeleteComment(c.id)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {currentUser && (
                <div className="comment-form">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                  <button onClick={handleAddComment} disabled={!commentInput.trim()}>
                    Post
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
