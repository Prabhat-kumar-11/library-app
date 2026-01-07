import React, { useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import './Login.css';

export const Login: React.FC = () => {
  const { login } = useLibrary();
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      await login(email, isAdmin);
    }
  };

  const handleQuickLogin = async (userEmail: string, admin: boolean) => {
    await login(userEmail, admin);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>📚 Library Management System</h1>
        <p className="login-subtitle">Sign in to browse and borrow books</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <span>Login as Administrator</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="quick-login">
          <p className="quick-login-title">Quick Login (Demo)</p>
          <div className="quick-login-buttons">
            <button
              onClick={() => handleQuickLogin('user@example.com', false)}
              className="btn btn-secondary"
            >
              👤 Login as User
            </button>
            <button
              onClick={() => handleQuickLogin('admin@example.com', true)}
              className="btn btn-admin"
            >
              👨‍💼 Login as Admin
            </button>
          </div>
        </div>

        <div className="login-info">
          <h3>Demo Information:</h3>
          <ul>
            <li><strong>User Account:</strong> Can borrow up to 2 books, view library</li>
            <li><strong>Admin Account:</strong> Can add/remove books, update stock, view all users</li>
            <li>Data persists in browser localStorage</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

