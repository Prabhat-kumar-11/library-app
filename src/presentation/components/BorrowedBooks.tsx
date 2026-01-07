import React from 'react';
import { Book } from '../../domain/models/Book';
import { useLibrary } from '../contexts/LibraryContext';
import './BorrowedBooks.css';

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
      <div className="borrowed-empty">
        <p>You haven't borrowed any books yet.</p>
      </div>
    );
  }

  return (
    <div className="borrowed-books">
      <div className="borrowed-header">
        <h3>My Borrowed Books ({books.length}/2)</h3>
      </div>
      
      <div className="borrowed-list">
        {books.map((book) => (
          <div key={book.isbn} className="borrowed-item">
            <div className="borrowed-info">
              <h4>{book.title}</h4>
              <p className="borrowed-author">{book.author}</p>
              <p className="borrowed-isbn">ISBN: {book.isbn}</p>
            </div>
            <button
              className="btn btn-return"
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

