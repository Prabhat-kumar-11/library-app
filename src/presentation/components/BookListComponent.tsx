import React, { useState } from 'react';
import { Book } from '../../domain/models/Book';
import { useLibrary } from '../contexts/LibraryContext';

interface BookListProps {
  books: Book[];
  showBorrowButton?: boolean;
}

export const BookListComponent: React.FC<BookListProps> = ({
  books,
  showBorrowButton = true,
}) => {
  const { currentUser, borrowBook, error } = useLibrary();
  const [isLoading, setIsLoading] = useState(false);

  const handleBorrow = async (isbn: string) => {
    setIsLoading(true);
    try {
      await borrowBook(isbn);
    } finally {
      setIsLoading(false);
    }
  };

  const canUserBorrowBook = (book: Book): boolean => {
    if (!currentUser) return false;
    return currentUser.canBorrow(book);
  };

  const getButtonText = (book: Book): string => {
    if (!book.isAvailable()) {
      return 'Not Available';
    }
    if (currentUser?.hasBorrowed(book.isbn)) {
      return 'Already Borrowed';
    }
    if (currentUser && currentUser.borrowedBooks.length >= 2) {
      return 'Limit Reached';
    }
    return 'Borrow';
  };

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Books Available</h2>
        <p className="text-gray-600">The library is currently empty. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.isbn}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex justify-between items-start gap-3">
                <h3 className="text-lg font-semibold text-white flex-1">
                  {book.title}
                </h3>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    book.availableCopies === 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {book.availableCopies === 0
                    ? '0 Available'
                    : `${book.availableCopies} ${
                        book.availableCopies === 1 ? 'copy' : 'copies'
                      }`}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-3">
                <span className="font-medium">by</span> {book.author}
              </p>

              {book.description && (
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {book.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  ISBN: {book.isbn}
                </span>
                {book.publishedYear && (
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {book.publishedYear}
                  </span>
                )}
              </div>

              {showBorrowButton && (
                <button
                  className={`w-full py-2 px-3 rounded-lg font-medium transition-colors ${
                    canUserBorrowBook(book)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => handleBorrow(book.isbn)}
                  disabled={!canUserBorrowBook(book) || isLoading}
                >
                  {isLoading ? 'Loading...' : getButtonText(book)}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
