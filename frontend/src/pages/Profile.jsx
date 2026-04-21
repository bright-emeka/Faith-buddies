// Profile page - displays user profile and their posts
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, getUserPosts, getFollowers, getFollowing, toggleFollow, checkFollowing, updateUserProfile } from '../services/api';
import { auth } from '../services/firebase';
import Post from '../components/Post';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', avatar: '', religion: '' });

  const currentUser = auth.currentUser;
  const isOwnProfile = currentUser && currentUser.uid === userId;

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const userData = await getUserProfile(userId);
      setUser(userData);

      const userPosts = await getUserPosts(userId);
      setPosts(userPosts);

      const followersList = await getFollowers(userId);
      setFollowers(followersList);

      const followingList = await getFollowing(userId);
      setFollowing(followingList);

      if (currentUser && currentUser.uid !== userId) {
        const result = await checkFollowing(userId);
        setIsFollowing(result.following);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const result = await toggleFollow(userId);
      setIsFollowing(result.following);
      
      // Update followers count
      setUser({
        ...user,
        followersCount: result.following ? user.followersCount + 1 : user.followersCount - 1,
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleEdit = () => {
    setEditForm({
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      religion: user.religion || 'Christian',
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateUserProfile(userId, editForm);
      setUser({ ...user, ...editForm });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.avatar} alt={user.name} className="profile-avatar" />
        <div className="profile-info">
          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Avatar URL</label>
                <input
                  type="text"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Religion</label>
                <select
                  value={editForm.religion}
                  onChange={(e) => setEditForm({ ...editForm, religion: e.target.value })}
                >
                  <option value="Christian">Christian</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Jewish">Jewish</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="edit-actions">
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h1>{user.name}</h1>
              <p className="profile-bio">{user.bio}</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">{user.postsCount || 0}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{user.followersCount || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{user.followingCount || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
            </>
          )}
          {!isOwnProfile && (
            <button
              className={`follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={handleFollow}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          {isOwnProfile && !isEditing && (
            <button className="edit-profile-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts ({posts.length})
        </button>
        <button
          className={`tab ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => setActiveTab('followers')}
        >
          Followers ({followers.length})
        </button>
        <button
          className={`tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Following ({following.length})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'posts' && (
          <div className="posts-list">
            {posts.length === 0 ? (
              <p>No posts yet</p>
            ) : (
              posts.map((post) => <Post key={post.id} post={post} />)
            )}
          </div>
        )}

        {activeTab === 'followers' && (
          <div className="users-grid">
            {followers.map((follower) => (
              <div key={follower.uid} className="user-list-item">
                <img src={follower.avatar} alt={follower.name} />
                <h4>{follower.name}</h4>
                <p>{follower.bio}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'following' && (
          <div className="users-grid">
            {following.map((followingUser) => (
              <div key={followingUser.uid} className="user-list-item">
                <img src={followingUser.avatar} alt={followingUser.name} />
                <h4>{followingUser.name}</h4>
                <p>{followingUser.bio}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
