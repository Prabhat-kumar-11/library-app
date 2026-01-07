import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Book, BookProps } from "../../domain/models/Book";
import { User } from "../../domain/models/User";
import { MockApiService } from "../../infrastructure/api/MockApiService";
import { AuthService } from "../../infrastructure/auth/AuthService";

interface LibraryContextType {
  books: Book[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  borrowBook: (isbn: string) => Promise<void>;
  returnBook: (isbn: string) => Promise<void>;
  addBook: (bookData: BookProps) => Promise<void>;
  updateBookStock: (isbn: string, copies: number) => Promise<void>;
  removeBook: (isbn: string) => Promise<void>;
  refreshBooks: () => Promise<void>;
  login: (email: string, isAdmin?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeLibrary();
  }, []);

  const initializeLibrary = async () => {
    try {
      setLoading(true);
      await MockApiService.initialize();

      // Check for existing user session
      const user = AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }

      await refreshBooks();
    } catch (err) {
      setError("Failed to initialize library");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshBooks = async () => {
    try {
      const response = await MockApiService.getBooks();
      if (response.data) {
        setBooks(response.data);
      } else {
        setError(response.error || "Failed to fetch books");
      }
    } catch (err) {
      setError("Failed to fetch books");
      console.error(err);
    }
  };

  const borrowBook = async (isbn: string) => {
    if (!currentUser) {
      setError("You must be logged in to borrow books");
      return;
    }

    try {
      setError(null);
      const response = await MockApiService.borrowBook(currentUser, isbn);

      if (response.error) {
        setError(response.error);
        return;
      }

      // Update local state
      await refreshBooks();

      // Update current user
      const updatedUser = MockApiService.getUser(currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    } catch (err) {
      setError("Failed to borrow book");
      console.error(err);
    }
  };

  const returnBook = async (isbn: string) => {
    if (!currentUser) {
      setError("You must be logged in to return books");
      return;
    }

    try {
      setError(null);
      const response = await MockApiService.returnBook(currentUser, isbn);

      if (response.error) {
        setError(response.error);
        return;
      }

      // Update local state
      await refreshBooks();

      // Update current user
      const updatedUser = MockApiService.getUser(currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    } catch (err) {
      setError("Failed to return book");
      console.error(err);
    }
  };

  const addBook = async (bookData: BookProps) => {
    if (!currentUser) {
      setError("You must be logged in");
      return;
    }

    try {
      setError(null);
      const response = await MockApiService.addBook(currentUser, bookData);

      if (response.error) {
        setError(response.error);
        return;
      }

      await refreshBooks();
    } catch (err) {
      setError("Failed to add book");
      console.error(err);
    }
  };

  const updateBookStock = async (isbn: string, copies: number) => {
    if (!currentUser) {
      setError("You must be logged in");
      return;
    }

    try {
      setError(null);
      const response = await MockApiService.updateBookStock(
        currentUser,
        isbn,
        copies
      );

      if (response.error) {
        setError(response.error);
        return;
      }

      await refreshBooks();
    } catch (err) {
      setError("Failed to update book stock");
      console.error(err);
    }
  };

  const removeBook = async (isbn: string) => {
    if (!currentUser) {
      setError("You must be logged in");
      return;
    }

    try {
      setError(null);
      const response = await MockApiService.removeBook(currentUser, isbn);

      if (response.error) {
        setError(response.error);
        return;
      }

      await refreshBooks();
    } catch (err) {
      setError("Failed to remove book");
      console.error(err);
    }
  };

  const login = async (email: string, isAdmin: boolean = false) => {
    try {
      setError(null);
      const role = isAdmin ? ("ADMIN" as const) : ("USER" as const);
      const user = await AuthService.mockLogin(email, role);
      setCurrentUser(user);
    } catch (err) {
      setError("Failed to login");
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setCurrentUser(null);
    } catch (err) {
      setError("Failed to logout");
      console.error(err);
    }
  };

  const value: LibraryContextType = {
    books,
    currentUser,
    loading,
    error,
    borrowBook,
    returnBook,
    addBook,
    updateBookStock,
    removeBook,
    refreshBooks,
    login,
    logout,
  };

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
};
