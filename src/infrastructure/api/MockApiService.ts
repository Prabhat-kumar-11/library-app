import { Book, type BookProps } from '../../domain/models/Book';
import { User } from '../../domain/models/User';
import { Library } from '../../domain/models/Library';
import { LocalStorageService } from '../storage/LocalStorage';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export class MockApiService {
  private static library: Library = new Library();
  private static users: Map<string, User> = new Map();
  private static initialized = false;

  // Simulate network delay
  private static delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async initialize(): Promise<void> {
    if (this.initialized) return;

    // Load from localStorage or initialize with sample data
    const savedBooks = LocalStorageService.getBooks();
    const savedUsers = LocalStorageService.getUsers();

    if (savedBooks.length > 0) {
      savedBooks.forEach((bookData: BookProps) => {
        const book = new Book(bookData);
        this.library.addBook(book);
      });
    } else {
      // Initialize with sample books
      this.initializeSampleBooks();
    }

    if (savedUsers.length > 0) {
      savedUsers.forEach((userData: any) => {
        const user = new User({
          ...userData,
          borrowedBooks: userData.borrowedBooks?.map((b: BookProps) => new Book(b)) || [],
        });
        this.users.set(user.id, user);
      });
    }

    this.initialized = true;
  }

  private static initializeSampleBooks(): void {
    const sampleBooks: BookProps[] = [
      {
        isbn: '978-0-132350-88-4',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        availableCopies: 3,
        description: 'A Handbook of Agile Software Craftsmanship',
        publishedYear: 2008,
      },
      {
        isbn: '978-0-201633-61-2',
        title: 'Design Patterns',
        author: 'Gang of Four',
        availableCopies: 2,
        description: 'Elements of Reusable Object-Oriented Software',
        publishedYear: 1994,
      },
      {
        isbn: '978-0-135957-05-9',
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt, David Thomas',
        availableCopies: 4,
        description: 'Your Journey to Mastery',
        publishedYear: 2019,
      },
      {
        isbn: '978-0-134685-99-1',
        title: 'Effective Java',
        author: 'Joshua Bloch',
        availableCopies: 2,
        description: 'Best Practices for the Java Platform',
        publishedYear: 2017,
      },
      {
        isbn: '978-1-449355-73-9',
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        availableCopies: 1,
        description: 'The Big Ideas Behind Reliable, Scalable Systems',
        publishedYear: 2017,
      },
    ];

    sampleBooks.forEach(bookData => {
      const book = new Book(bookData);
      this.library.addBook(book);
    });

    this.saveLibraryState();
  }

  private static saveLibraryState(): void {
    const books = this.library.getAllBooks().map(book => book.toJSON());
    LocalStorageService.saveBooks(books);
  }

  private static saveUsersState(): void {
    const users = Array.from(this.users.values()).map(user => user.toJSON());
    LocalStorageService.saveUsers(users);
  }

  static async getBooks(): Promise<ApiResponse<Book[]>> {
    await this.delay();
    try {
      const books = this.library.getAllBooks();
      return { data: books, status: 200 };
    } catch (error) {
      return { error: 'Failed to fetch books', status: 500 };
    }
  }

  static async borrowBook(user: User, isbn: string): Promise<ApiResponse<void>> {
    await this.delay();
    try {
      this.library.borrowBook(user, isbn);
      this.users.set(user.id, user);
      this.saveLibraryState();
      this.saveUsersState();
      return { status: 200 };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to borrow book';
      const status = message.includes('not found') ? 404 : 
                     message.includes('not available') ? 400 :
                     message.includes('already borrowed') ? 400 :
                     message.includes('Cannot borrow') ? 400 : 500;
      return { error: message, status };
    }
  }

  static async returnBook(user: User, isbn: string): Promise<ApiResponse<void>> {
    await this.delay();
    try {
      this.library.returnBook(user, isbn);
      this.users.set(user.id, user);
      this.saveLibraryState();
      this.saveUsersState();
      return { status: 200 };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to return book';
      const status = message.includes('not found') ? 404 : 400;
      return { error: message, status };
    }
  }

  // Admin-only methods
  static async addBook(user: User, bookData: BookProps): Promise<ApiResponse<Book>> {
    await this.delay();
    try {
      if (!user.isAdmin()) {
        return { error: 'Unauthorized: Admin access required', status: 403 };
      }

      const book = new Book(bookData);
      this.library.addBook(book);
      this.saveLibraryState();
      return { data: book, status: 201 };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add book';
      return { error: message, status: 400 };
    }
  }

  static async updateBookStock(user: User, isbn: string, copies: number): Promise<ApiResponse<void>> {
    await this.delay();
    try {
      if (!user.isAdmin()) {
        return { error: 'Unauthorized: Admin access required', status: 403 };
      }

      this.library.updateBookStock(isbn, copies);
      this.saveLibraryState();
      return { status: 200 };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update book stock';
      const status = message.includes('not found') ? 404 : 400;
      return { error: message, status };
    }
  }

  static async removeBook(user: User, isbn: string): Promise<ApiResponse<void>> {
    await this.delay();
    try {
      if (!user.isAdmin()) {
        return { error: 'Unauthorized: Admin access required', status: 403 };
      }

      this.library.removeBook(isbn);
      this.saveLibraryState();
      return { status: 200 };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove book';
      const status = message.includes('not found') ? 404 : 400;
      return { error: message, status };
    }
  }

  static async getAllUsers(user: User): Promise<ApiResponse<User[]>> {
    await this.delay();
    try {
      if (!user.isAdmin()) {
        return { error: 'Unauthorized: Admin access required', status: 403 };
      }

      const users = Array.from(this.users.values());
      return { data: users, status: 200 };
    } catch (error) {
      return { error: 'Failed to fetch users', status: 500 };
    }
  }

  static getLibrary(): Library {
    return this.library;
  }

  static registerUser(user: User): void {
    this.users.set(user.id, user);
    this.saveUsersState();
  }

  static getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }
}

