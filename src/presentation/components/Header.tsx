import React from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import './Header.css';

export const Header: React.FC = () => {
  const { currentUser, logout } = useLibrary();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">📚 Library Management</h1>
        </div>
        
        {currentUser && (
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className={`user-role ${currentUser.isAdmin() ? 'admin' : 'user'}`}>
                {currentUser.isAdmin() ? '👨‍💼 Admin' : '👤 User'}
              </span>
            </div>
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

