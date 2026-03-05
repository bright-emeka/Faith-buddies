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
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

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
      if (isOwnProfile) {
        setEditName(userData.name || '');
        setEditBio(userData.bio || '');
        setEditAvatar(userData.avatar || '');
      }

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

  const handleSaveProfile = async () => {
    try {
      const updated = await updateUserProfile(userId, {
        name: editName,
        bio: editBio,
        avatar: editAvatar,
      });
      setUser(updated);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
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
          {!isOwnProfile && (
            <button
              className={`follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={handleFollow}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          {isOwnProfile && (
            <button
              className="edit-profile-btn"
              onClick={() => setEditing((e) => !e)}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </div>
      </div>

      {isOwnProfile && editing && (
        <div className="edit-form">
          <div className="form-group">
            <label>Name</label>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Avatar URL</label>
            <input value={editAvatar} onChange={(e) => setEditAvatar(e.target.value)} />
          </div>
          <button className="submit-btn" onClick={handleSaveProfile}>Save</button>
        </div>
      )}
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
