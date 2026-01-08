import React, { useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';

export const BorrowedBooksPage: React.FC = () => {
  const { currentUser, returnBook, loading } = useLibrary();
  const [returnError, setReturnError] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your borrowed books.</p>
      </div>
    );
  }

  const borrowedBooks = currentUser.borrowedBooks;

  const handleReturn = async (isbn: string) => {
    try {
      setReturnError(null);
      await returnBook(isbn);
    } catch (error) {
      setReturnError('Failed to return book');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Borrowed Books</h1>
        <p className="text-gray-600">
          You have borrowed {borrowedBooks.length} of 2 books
        </p>
        <div className="mt-4 bg-white rounded-lg p-4 border border-blue-200 bg-blue-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-900 font-medium">Borrowing limit</span>
            <div className="w-48 h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  borrowedBooks.length >= 2 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${(borrowedBooks.length / 2) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {returnError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ⚠️ {returnError}
        </div>
      )}

      {borrowedBooks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Books Borrowed
          </h2>
          <p className="text-gray-600">
            You haven't borrowed any books yet. Go to "Available Books" to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {borrowedBooks.map((book) => (
            <div
              key={book.isbn}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">by {book.author}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                      ISBN: {book.isbn}
                    </span>
                    {book.description && (
                      <p className="text-sm text-gray-600 mt-2">{book.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleReturn(book.isbn)}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? 'Returning...' : 'Return Book'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
