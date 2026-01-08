import React from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { BookList } from '../components/BookList';

export const AvailableBooksPage: React.FC = () => {
  const { books, loading, error } = useLibrary();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Books</h1>
        <p className="text-gray-600">Browse and borrow books from our library</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      <BookList books={books} showBorrowButton={true} />
    </div>
  );
};
