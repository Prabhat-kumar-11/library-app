import React from 'react';
import { useLibrary } from '../contexts/LibraryContext';

export const Header: React.FC = () => {
  const { currentUser, logout } = useLibrary();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">📚 Library Management</h1>
          </div>

          {currentUser && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p
                  className={`text-xs ${
                    currentUser.isAdmin()
                      ? 'text-purple-600 font-medium'
                      : 'text-blue-600 font-medium'
                  }`}
                >
                  {currentUser.isAdmin() ? '👨‍💼 Admin' : '👤 User'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

