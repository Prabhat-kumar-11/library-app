import { describe, it, expect } from 'vitest';
import { Book } from './Book';

describe('Book', () => {
  describe('creation', () => {
    it('should create a book with valid properties', () => {
      const book = new Book({
        isbn: '978-0-123456-78-9',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        availableCopies: 3,
      });

      expect(book.isbn).toBe('978-0-123456-78-9');
      expect(book.title).toBe('Clean Code');
      expect(book.author).toBe('Robert C. Martin');
      expect(book.availableCopies).toBe(3);
    });

    it('should create a book with zero copies', () => {
      const book = new Book({
        isbn: '978-0-123456-78-9',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        availableCopies: 0,
      });

      expect(book.availableCopies).toBe(0);
    });

    it('should throw error for negative copies', () => {
      expect(() => {
        new Book({
          isbn: '978-0-123456-78-9',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          availableCopies: -1,
        });
      }).toThrow('Available copies cannot be negative');
    });

    it('should throw error for empty ISBN', () => {
      expect(() => {
        new Book({
          isbn: '',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          availableCopies: 1,
        });
      }).toThrow('ISBN is required');
    });

    it('should throw error for empty title', () => {
      expect(() => {
        new Book({
          isbn: '978-0-123456-78-9',
          title: '',
          author: 'Robert C. Martin',
          availableCopies: 1,
        });
      }).toThrow('Title is required');
    });

    it('should throw error for empty author', () => {
      expect(() => {
        new Book({
          isbn: '978-0-123456-78-9',
          title: 'Clean Code',
          author: '',
          availableCopies: 1,
        });
      }).toThrow('Author is required');
    });
  });

  describe('availability', () => {
    it('should return true when copies are available', () => {
      const book = new Book({
        isbn: '978-0-123456-78-9',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        availableCopies: 1,
      });

      expect(book.isAvailable()).toBe(true);
    });

    it('should return false when no copies are available', () => {
      const book = new Book({
        isbn: '978-0-123456-78-9',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        availableCopies: 0,
      });

      expect(book.isAvailable()).toBe(false);
    });
  });

  describe('copy management', () => {
    it('should decrease available copies when borrowed', () => {
      const book = new Book({
        isbn: '978-0-123456-78-9',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        availableCopies: 3,
      });

      book.decrementCopies();

      expect(book.availableCopies).toBe(2);
    });

    it('should throw error when trying to borrow with no copies available', () => {
      const book = new Book({
        isbn: '978-0-123456-78-9',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        availableCopies: 0,
      });

      expect(() => book.decrementCopies()).toThrow('No copies available to borrow');
    });

    it('should increase available copies when returned', () => {
      const book = new Book({
        isbn: '978-0-123456-78-9',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        availableCopies: 2,
      });

      book.incrementCopies();

      expect(book.availableCopies).toBe(3);
    });
  });
});

