import React, { useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { MockApiService } from '../../infrastructure/api/MockApiService';
import { User } from '../../domain/models/User';

export const BorrowedBooksTrackingPage: React.FC = () => {
  const { currentUser } = useLibrary();
  const [users, setUsers] = useState<User[]>([]);

  React.useEffect(() => {
    if (currentUser?.isAdmin()) {
      loadUsers();
    }
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      const response = await MockApiService.getAllUsers(currentUser!);
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  if (!currentUser?.isAdmin()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">You don't have permission to view this page.</p>
      </div>
    );
  }

  const usersWithBorrowedBooks = users.filter(
    (user) => user.borrowedBooks.length > 0
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Borrowed Books Tracking
        </h1>
        <p className="text-gray-600">Monitor which users have borrowed books</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-3xl font-bold text-blue-600">{users.length}</div>
          <p className="text-gray-600 text-sm mt-1">Total Users</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-3xl font-bold text-orange-600">
            {usersWithBorrowedBooks.length}
          </div>
          <p className="text-gray-600 text-sm mt-1">Users with Books</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-3xl font-bold text-green-600">
            {usersWithBorrowedBooks.reduce(
              (acc, user) => acc + user.borrowedBooks.length,
              0
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">Books Borrowed</p>
        </div>
      </div>

      {/* Borrowed Books Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          {usersWithBorrowedBooks.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No books are currently borrowed.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Book Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersWithBorrowedBooks.map((user, userIndex) =>
                  user.borrowedBooks.map((book, bookIndex) => (
                    <tr
                      key={`${user.id}-${book.isbn}`}
                      className={`border-b border-gray-200 ${
                        (userIndex + bookIndex) % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {book.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                        {book.isbn}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          Borrowed
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* User Details Section */}
      {usersWithBorrowedBooks.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">User Details</h2>
          <div className="grid grid-cols-1 gap-6">
            {usersWithBorrowedBooks.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.isAdmin()
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.isAdmin() ? 'Admin' : 'User'}
                  </span>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Borrowed Books ({user.borrowedBooks.length})
                  </h4>
                  <div className="space-y-2">
                    {user.borrowedBooks.map((book) => (
                      <div
                        key={book.isbn}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {book.title}
                          </p>
                          <p className="text-sm text-gray-600">{book.author}</p>
                        </div>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                          Borrowed
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
