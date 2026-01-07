import { Book } from './Book';
import { User } from './User';

export class Library {
  private books: Map<string, Book>;

  constructor() {
    this.books = new Map();
  }

  getAllBooks(): Book[] {
    return Array.from(this.books.values());
  }

  findBookByIsbn(isbn: string): Book | undefined {
    return this.books.get(isbn);
  }

  addBook(book: Book): void {
    if (this.books.has(book.isbn)) {
      throw new Error(`Book with ISBN ${book.isbn} already exists`);
    }
    this.books.set(book.isbn, book);
  }

  updateBookStock(isbn: string, copies: number): void {
    const book = this.findBookByIsbn(isbn);
    if (!book) {
      throw new Error('Book not found');
    }

    // Create a new book instance with updated copies
    const updatedBook = new Book({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      availableCopies: copies,
      description: book.description,
      publishedYear: book.publishedYear,
    });

    this.books.set(isbn, updatedBook);
  }

  borrowBook(user: User, isbn: string): void {
    const book = this.findBookByIsbn(isbn);
    
    if (!book) {
      throw new Error('Book not found');
    }

    if (!book.isAvailable()) {
      throw new Error('Book is not available');
    }

    if (!user.canBorrow(book)) {
      if (user.hasBorrowed(isbn)) {
        throw new Error('You have already borrowed this book');
      }
      throw new Error('Cannot borrow more than 2 books');
    }

    book.decrementCopies();
    user.borrowBook(book);
  }

  returnBook(user: User, isbn: string): void {
    const book = this.findBookByIsbn(isbn);
    
    if (!book) {
      throw new Error('Book not found');
    }

    user.returnBook(isbn);
    book.incrementCopies();
  }

  removeBook(isbn: string): void {
    if (!this.books.has(isbn)) {
      throw new Error('Book not found');
    }
    this.books.delete(isbn);
  }

  toJSON() {
    return {
      books: this.getAllBooks().map(book => book.toJSON()),
    };
  }
}

