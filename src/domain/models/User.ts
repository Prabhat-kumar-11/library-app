import { Book } from './Book';

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface UserProps {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  borrowedBooks?: Book[];
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  private _borrowedBooks: Book[];

  private static readonly MAX_BORROWED_BOOKS = 2;

  constructor(props: UserProps) {
    this.validateProps(props);
    
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.role = props.role;
    this._borrowedBooks = props.borrowedBooks || [];
  }

  private validateProps(props: UserProps): void {
    if (!props.email || props.email.trim() === '') {
      throw new Error('Email is required');
    }
    if (!props.name || props.name.trim() === '') {
      throw new Error('Name is required');
    }
  }

  get borrowedBooks(): Book[] {
    return [...this._borrowedBooks];
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  canBorrow(book: Book): boolean {
    // Check if user already has this book
    if (this.hasBorrowed(book.isbn)) {
      return false;
    }

    // Check if user has reached borrowing limit
    if (this._borrowedBooks.length >= User.MAX_BORROWED_BOOKS) {
      return false;
    }

    return true;
  }

  borrowBook(book: Book): void {
    if (this._borrowedBooks.length >= User.MAX_BORROWED_BOOKS) {
      throw new Error('Cannot borrow more than 2 books');
    }

    if (this.hasBorrowed(book.isbn)) {
      throw new Error('You have already borrowed this book');
    }

    this._borrowedBooks.push(book);
  }

  returnBook(isbn: string): void {
    const index = this._borrowedBooks.findIndex(book => book.isbn === isbn);
    
    if (index === -1) {
      throw new Error('Book not found in borrowed list');
    }

    this._borrowedBooks.splice(index, 1);
  }

  hasBorrowed(isbn: string): boolean {
    return this._borrowedBooks.some(book => book.isbn === isbn);
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      borrowedBooks: this._borrowedBooks.map(book => book.toJSON()),
    };
  }
}

