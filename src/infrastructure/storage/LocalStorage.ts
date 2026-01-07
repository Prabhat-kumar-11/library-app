export class LocalStorageService {
  private static readonly LIBRARY_KEY = 'library_books';
  private static readonly USERS_KEY = 'library_users';
  private static readonly CURRENT_USER_KEY = 'library_current_user';

  static saveBooks(books: any[]): void {
    try {
      localStorage.setItem(this.LIBRARY_KEY, JSON.stringify(books));
    } catch (error) {
      console.error('Failed to save books to localStorage:', error);
    }
  }

  static getBooks(): any[] {
    try {
      const data = localStorage.getItem(this.LIBRARY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load books from localStorage:', error);
      return [];
    }
  }

  static saveUsers(users: any[]): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users to localStorage:', error);
    }
  }

  static getUsers(): any[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load users from localStorage:', error);
      return [];
    }
  }

  static saveCurrentUser(user: any): void {
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save current user to localStorage:', error);
    }
  }

  static getCurrentUser(): any | null {
    try {
      const data = localStorage.getItem(this.CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load current user from localStorage:', error);
      return null;
    }
  }

  static clearCurrentUser(): void {
    try {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    } catch (error) {
      console.error('Failed to clear current user from localStorage:', error);
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.LIBRARY_KEY);
      localStorage.removeItem(this.USERS_KEY);
      localStorage.removeItem(this.CURRENT_USER_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

