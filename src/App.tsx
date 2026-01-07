import React from "react";
import {
  LibraryProvider,
  useLibrary,
} from "./presentation/contexts/LibraryContext";
import { Login } from "./presentation/components/Login";
import { Header } from "./presentation/components/Header";
import { BookList } from "./presentation/components/BookList";
import { BorrowedBooks } from "./presentation/components/BorrowedBooks";
import { AdminPanel } from "./presentation/components/AdminPanel";
import "./App.css";

const LibraryApp: React.FC = () => {
  const { currentUser, books, loading, error } = useLibrary();

  if (!currentUser) {
    return <Login />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading library...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="container">
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
            </div>
          )}

          {currentUser.isAdmin() && <AdminPanel />}

          {currentUser.borrowedBooks.length > 0 && (
            <BorrowedBooks books={currentUser.borrowedBooks} />
          )}

          <section className="library-section">
            <h2>Available Books</h2>
            <BookList books={books} />
          </section>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <LibraryProvider>
      <LibraryApp />
    </LibraryProvider>
  );
}

export default App;
