import React, { useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Library</h1>
            <p className="text-gray-600">Management System</p>
          </div>

          <p className="text-center text-gray-600 text-sm mb-8">
            Sign in to browse and borrow books
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                id="admin-checkbox"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-600"
              />
              <label htmlFor="admin-checkbox" className="ml-2 text-sm text-gray-700">
                Login as Administrator
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">OR</span>
            </div>
          </div>

          {/* Quick Login */}
          <div className="space-y-3 mb-8">
            <p className="text-sm font-semibold text-gray-900 text-center mb-3">
              Quick Login (Demo)
            </p>
            <button
              type="button"
              onClick={() => handleQuickLogin('user@example.com', false)}
              className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              👤 Login as User
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@example.com', true)}
              className="w-full bg-purple-100 text-purple-700 py-2 rounded-lg font-medium hover:bg-purple-200 transition-colors"
            >
              👨‍💼 Login as Admin
            </button>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              📖 Demo Information:
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                <strong>User Account:</strong> Can borrow up to 2 books
              </li>
              <li>
                <strong>Admin Account:</strong> Can manage books and users
              </li>
              <li>
                <strong>Storage:</strong> Data persists in browser storage
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

