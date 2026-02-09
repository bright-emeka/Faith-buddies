// Header component with app name and logout
import React from 'react';
import { logOut } from '../services/auth';

const Header = ({ userName, onLogout }) => {
  const handleLogout = async () => {
    try {
      await logOut();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="app-title">📖 Bible Social</h1>
        <div className="header-right">
          <span className="user-name">Hello, {userName}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
