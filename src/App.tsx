import React, { useState, useEffect } from 'react';
import {
  LibraryProvider,
  useLibrary,
} from './presentation/contexts/LibraryContext';
import { Login } from './presentation/components/Login';
import { Header } from './presentation/components/Header';
import { SidebarNav } from './presentation/components/SidebarNav';
import { AvailableBooksPage } from './presentation/pages/AvailableBooksPage';
import { BorrowedBooksPage } from './presentation/pages/BorrowedBooksPage';
import { InventoryPage } from './presentation/pages/InventoryPage';
import { BorrowedBooksTrackingPage } from './presentation/pages/BorrowedBooksTrackingPage';

type PageType = 'available' | 'borrowed' | 'inventory' | 'tracking';

const LibraryApp: React.FC = () => {
  const { currentUser, loading, error } = useLibrary();
  const [currentPage, setCurrentPage] = useState<PageType>('available');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle navigation
  const navigateTo = (page: PageType) => {
    const pathMap: Record<PageType, string> = {
      available: '/',
      borrowed: '/borrowed',
      inventory: '/inventory',
      tracking: '/tracking',
    };
    window.history.pushState(null, '', pathMap[page]);
    setCurrentPage(page);
  };

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/') setCurrentPage('available');
      else if (path === '/borrowed') setCurrentPage('borrowed');
      else if (path === '/inventory') setCurrentPage('inventory');
      else if (path === '/tracking') setCurrentPage('tracking');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize from current URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') setCurrentPage('available');
    else if (path === '/borrowed') setCurrentPage('borrowed');
    else if (path === '/inventory') setCurrentPage('inventory');
    else if (path === '/tracking') setCurrentPage('tracking');
  }, []);

  if (!currentUser) {
    return <Login />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside
          className={`fixed lg:relative w-64 bg-white border-r border-gray-200 h-[calc(100vh-80px)] overflow-y-auto transition-transform z-40 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <div className="p-6">
            <SidebarNav
              isAdmin={currentUser.isAdmin()}
              currentPage={currentPage}
              onNavigate={(page) => {
                navigateTo(page);
                setSidebarOpen(false);
              }}
            />
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden mb-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Page Error */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            {/* Pages */}
            {currentPage === 'available' && <AvailableBooksPage />}
            {currentPage === 'borrowed' && <BorrowedBooksPage />}
            {currentPage === 'inventory' && currentUser.isAdmin() && <InventoryPage />}
            {currentPage === 'tracking' && currentUser.isAdmin() && (
              <BorrowedBooksTrackingPage />
            )}
          </div>
        </main>
      </div>
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
