import { describe, it, expect } from 'vitest';
import { User, UserRole } from './User';
import { Book } from './Book';

describe('User', () => {
  const createTestBook = (isbn: string, title: string) => {
    return new Book({
      isbn,
      title,
      author: 'Test Author',
      availableCopies: 5,
    });
  };

  describe('creation', () => {
    it('should create a user with valid properties', () => {
      const user = new User({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
      });

      expect(user.id).toBe('user-1');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe(UserRole.USER);
      expect(user.borrowedBooks).toEqual([]);
    });

    it('should create an admin user', () => {
      const user = new User({
        id: 'admin-1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: UserRole.ADMIN,
      });

      expect(user.role).toBe(UserRole.ADMIN);
      expect(user.isAdmin()).toBe(true);
    });

    it('should throw error for empty email', () => {
      expect(() => {
        new User({
          id: 'user-1',
          email: '',
          name: 'Test User',
          role: UserRole.USER,
        });
      }).toThrow('Email is required');
    });

    it('should throw error for empty name', () => {
      expect(() => {
        new User({
          id: 'user-1',
          email: 'test@example.com',
          name: '',
          role: UserRole.USER,
        });
      }).toThrow('Name is required');
    });
  });

  describe('borrowing books', () => {
    it('should allow borrowing a book when under limit', () => {
      const user = new User({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
      });
      const book = createTestBook('978-1', 'Book 1');

      user.borrowBook(book);

      expect(user.borrowedBooks).toHaveLength(1);
      expect(user.borrowedBooks[0].isbn).toBe('978-1');
    });

    it('should allow borrowing up to 2 books', () => {
      const user = new User({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
      });
      const book1 = createTestBook('978-1', 'Book 1');
      const book2 = createTestBook('978-2', 'Book 2');

      user.borrowBook(book1);
      user.borrowBook(book2);

      expect(user.borrowedBooks).toHaveLength(2);
    });

    it('should throw error when borrowing more than 2 books', () => {
      const user = new User({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
      });
      const book1 = createTestBook('978-1', 'Book 1');
      const book2 = createTestBook('978-2', 'Book 2');
      const book3 = createTestBook('978-3', 'Book 3');

      user.borrowBook(book1);
      user.borrowBook(book2);

      expect(() => user.borrowBook(book3)).toThrow('Cannot borrow more than 2 books');
    });

    it('should throw error when borrowing same book twice', () => {
      const user = new User({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
      });
      const book = createTestBook('978-1', 'Book 1');

      user.borrowBook(book);

      expect(() => user.borrowBook(book)).toThrow('You have already borrowed this book');
    });

    it('should check if user can borrow a book', () => {
      const user = new User({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
      });
      const book = createTestBook('978-1', 'Book 1');

      expect(user.canBorrow(book)).toBe(true);

      user.borrowBook(book);
      expect(user.canBorrow(book)).toBe(false);
    });
  });

  describe('returning books', () => {
    it('should allow returning a borrowed book', () => {
      const user = new User({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
      });
      const book = createTestBook('978-1', 'Book 1');

      user.borrowBook(book);
      user.returnBook(book.isbn);

      expect(user.borrowedBooks).toHaveLength(0);
    });

    it('should throw error when returning a book not borrowed', () => {
      const user = new User({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
      });

      expect(() => user.returnBook('978-1')).toThrow('Book not found in borrowed list');
    });
  });
});

