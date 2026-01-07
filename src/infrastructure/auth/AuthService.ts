import { User, UserRole } from '../../domain/models/User';
import { LocalStorageService } from '../storage/LocalStorage';
import { MockApiService } from '../api/MockApiService';

export enum AuthProvider {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}

export interface AuthToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: number;
}

export class AuthService {
  private static currentUser: User | null = null;
  private static currentToken: AuthToken | null = null;

  // Mock OAuth login - simulates third-party authentication
  static async loginWithProvider(provider: AuthProvider, mockEmail?: string): Promise<User> {
    // Simulate OAuth flow delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, this would redirect to OAuth provider and get user info
    // For mock, we'll create a user based on email
    const email = mockEmail || this.getMockEmailForProvider(provider);
    const name = this.getMockNameFromEmail(email);
    const userId = this.generateUserId(email);

    // Check if user exists or create new one
    let user = MockApiService.getUser(userId);
    
    if (!user) {
      // Determine role - for demo, make admin@example.com an admin
      const role = email === 'admin@example.com' ? UserRole.ADMIN : UserRole.USER;
      
      user = new User({
        id: userId,
        email,
        name,
        role,
      });

      MockApiService.registerUser(user);
    }

    // Generate mock JWT token
    const token: AuthToken = {
      token: this.generateMockToken(userId, email),
      userId,
      email,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    this.currentUser = user;
    this.currentToken = token;

    // Save to localStorage
    LocalStorageService.saveCurrentUser(user.toJSON());

    return user;
  }

  static async logout(): Promise<void> {
    this.currentUser = null;
    this.currentToken = null;
    LocalStorageService.clearCurrentUser();
  }

  static getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    const savedUser = LocalStorageService.getCurrentUser();
    if (savedUser) {
      this.currentUser = new User({
        ...savedUser,
        borrowedBooks: savedUser.borrowedBooks?.map((b: any) => b) || [],
      });
      return this.currentUser;
    }

    return null;
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static validateToken(token: string): boolean {
    if (!this.currentToken) return false;
    if (this.currentToken.token !== token) return false;
    if (this.currentToken.expiresAt < Date.now()) return false;
    return true;
  }

  private static getMockEmailForProvider(provider: AuthProvider): string {
    switch (provider) {
      case AuthProvider.GOOGLE:
        return 'user@gmail.com';
      case AuthProvider.GITHUB:
        return 'user@github.com';
      default:
        return 'user@example.com';
    }
  }

  private static getMockNameFromEmail(email: string): string {
    const username = email.split('@')[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
  }

  private static generateUserId(email: string): string {
    // Simple hash function for demo purposes
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `user_${Math.abs(hash)}`;
  }

  private static generateMockToken(userId: string, email: string): string {
    // Mock JWT token (in real app, this would be signed by backend)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ userId, email, iat: Date.now() }));
    const signature = btoa(`mock_signature_${userId}`);
    return `${header}.${payload}.${signature}`;
  }

  // Mock login for testing - allows specifying role
  static async mockLogin(email: string, role: UserRole = UserRole.USER): Promise<User> {
    const userId = this.generateUserId(email);
    const name = this.getMockNameFromEmail(email);

    const user = new User({
      id: userId,
      email,
      name,
      role,
    });

    MockApiService.registerUser(user);

    const token: AuthToken = {
      token: this.generateMockToken(userId, email),
      userId,
      email,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    this.currentUser = user;
    this.currentToken = token;

    LocalStorageService.saveCurrentUser(user.toJSON());

    return user;
  }
}

