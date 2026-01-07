import { describe, it, expect, beforeEach } from 'vitest';
import { Library } from './Library';
import { Book } from './Book';
import { User, UserRole } from './User';

describe('Library', () => {
  let library: Library;
  let user: User;
  let book1: Book;
  let book2: Book;

  beforeEach(() => {
    library = new Library();
    user = new User({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.USER,
    });
    book1 = new Book({
      isbn: '978-1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      availableCopies: 3,
    });
    book2 = new Book({
      isbn: '978-2',
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      availableCopies: 2,
    });
  });

  describe('viewing books', () => {
    it('should return empty array when library is empty', () => {
      expect(library.getAllBooks()).toEqual([]);
    });

    it('should return all books in the library', () => {
      library.addBook(book1);
      library.addBook(book2);

      const books = library.getAllBooks();
      expect(books).toHaveLength(2);
      expect(books[0].isbn).toBe('978-1');
      expect(books[1].isbn).toBe('978-2');
    });

    it('should find a book by ISBN', () => {
      library.addBook(book1);

      const found = library.findBookByIsbn('978-1');
      expect(found).toBeDefined();
      expect(found?.title).toBe('Clean Code');
    });

    it('should return undefined for non-existent book', () => {
      const found = library.findBookByIsbn('978-999');
      expect(found).toBeUndefined();
    });
  });

  describe('adding books', () => {
    it('should add a new book to the library', () => {
      library.addBook(book1);

      expect(library.getAllBooks()).toHaveLength(1);
    });

    it('should throw error when adding duplicate book', () => {
      library.addBook(book1);

      expect(() => library.addBook(book1)).toThrow('Book with ISBN 978-1 already exists');
    });

    it('should update stock of existing book', () => {
      library.addBook(book1);
      library.updateBookStock('978-1', 5);

      const book = library.findBookByIsbn('978-1');
      expect(book?.availableCopies).toBe(5);
    });
  });

  describe('borrowing books', () => {
    it('should allow user to borrow a book', () => {
      library.addBook(book1);

      library.borrowBook(user, '978-1');

      expect(user.borrowedBooks).toHaveLength(1);
      expect(book1.availableCopies).toBe(2);
    });

    it('should throw error when book is not found', () => {
      expect(() => library.borrowBook(user, '978-999')).toThrow('Book not found');
    });

    it('should throw error when book is not available', () => {
      const unavailableBook = new Book({
        isbn: '978-3',
        title: 'Test Book',
        author: 'Test Author',
        availableCopies: 0,
      });
      library.addBook(unavailableBook);

      expect(() => library.borrowBook(user, '978-3')).toThrow('Book is not available');
    });

    it('should throw error when user has reached borrowing limit', () => {
      library.addBook(book1);
      library.addBook(book2);
      const book3 = new Book({
        isbn: '978-3',
        title: 'Test Book',
        author: 'Test Author',
        availableCopies: 1,
      });
      library.addBook(book3);

      library.borrowBook(user, '978-1');
      library.borrowBook(user, '978-2');

      expect(() => library.borrowBook(user, '978-3')).toThrow('Cannot borrow more than 2 books');
    });

    it('should throw error when user already has the book', () => {
      library.addBook(book1);

      library.borrowBook(user, '978-1');

      expect(() => library.borrowBook(user, '978-1')).toThrow('You have already borrowed this book');
    });
  });

  describe('returning books', () => {
    it('should allow user to return a borrowed book', () => {
      library.addBook(book1);
      library.borrowBook(user, '978-1');

      library.returnBook(user, '978-1');

      expect(user.borrowedBooks).toHaveLength(0);
      expect(book1.availableCopies).toBe(3);
    });

    it('should throw error when book is not found', () => {
      expect(() => library.returnBook(user, '978-999')).toThrow('Book not found');
    });

    it('should throw error when user has not borrowed the book', () => {
      library.addBook(book1);

      expect(() => library.returnBook(user, '978-1')).toThrow('Book not found in borrowed list');
    });
  });
});

