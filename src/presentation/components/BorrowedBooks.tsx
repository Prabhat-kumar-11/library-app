import React from 'react';
import { Book } from '../../domain/models/Book';
import { useLibrary } from '../contexts/LibraryContext';

interface BorrowedBooksProps {
  books: Book[];
}

export const BorrowedBooks: React.FC<BorrowedBooksProps> = ({ books }) => {
  const { returnBook } = useLibrary();

  const handleReturn = async (isbn: string) => {
    await returnBook(isbn);
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>You haven't borrowed any books yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          My Borrowed Books ({books.length}/2)
        </h3>
      </div>

      <div className="space-y-3">
        {books.map((book) => (
          <div
            key={book.isbn}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{book.title}</h4>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-xs text-gray-500 mt-1">ISBN: {book.isbn}</p>
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
              onClick={() => handleReturn(book.isbn)}
            >
              Return
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

