import React from 'react';
import { Book } from '../../domain/models/Book';
import { useLibrary } from '../contexts/LibraryContext';
import './BookList.css';

interface BookListProps {
  books: Book[];
  showBorrowButton?: boolean;
}

export const BookList: React.FC<BookListProps> = ({ books, showBorrowButton = true }) => {
  const { currentUser, borrowBook, error } = useLibrary();

  const handleBorrow = async (isbn: string) => {
    await borrowBook(isbn);
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
      <div className="empty-state">
        <div className="empty-icon">📚</div>
        <h2>No Books Available</h2>
        <p>The library is currently empty. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <div key={book.isbn} className="book-card">
          <div className="book-header">
            <h3 className="book-title">{book.title}</h3>
            <div className={`stock-badge ${book.availableCopies === 0 ? 'out-of-stock' : ''}`}>
              {book.availableCopies === 0 ? '0' : book.availableCopies} {book.availableCopies === 1 ? 'copy' : 'copies'}
            </div>
          </div>
          
          <p className="book-author">by {book.author}</p>
          
          {book.description && (
            <p className="book-description">{book.description}</p>
          )}
          
          <div className="book-meta">
            <span className="book-isbn">ISBN: {book.isbn}</span>
            {book.publishedYear && (
              <span className="book-year">Published: {book.publishedYear}</span>
            )}
          </div>

          {showBorrowButton && (
            <button
              className={`btn btn-borrow ${!canUserBorrowBook(book) ? 'btn-disabled' : ''}`}
              onClick={() => handleBorrow(book.isbn)}
              disabled={!canUserBorrowBook(book)}
            >
              {getButtonText(book)}
            </button>
          )}
        </div>
      ))}
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

