import React, { useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { Modal } from '../components/Modal';
import { Book } from '../../domain/models/Book';

export const InventoryPage: React.FC = () => {
  const { books, currentUser, addBook, updateBookStock, removeBook, loading, error } =
    useLibrary();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    availableCopies: 1,
    description: '',
    publishedYear: new Date().getFullYear(),
  });

  const [updateCopies, setUpdateCopies] = useState(0);

  if (!currentUser?.isAdmin()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">You don't have permission to view this page.</p>
      </div>
    );
  }

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBook(formData);
      setFormData({
        isbn: '',
        title: '',
        author: '',
        availableCopies: 1,
        description: '',
        publishedYear: new Date().getFullYear(),
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBook) {
      try {
        await updateBookStock(selectedBook.isbn, updateCopies);
        setShowUpdateModal(false);
        setSelectedBook(null);
        setUpdateCopies(0);
      } catch (error) {
        console.error('Failed to update stock:', error);
      }
    }
  };

  const handleRemoveBook = async (isbn: string) => {
    if (window.confirm('Are you sure you want to remove this book?')) {
      try {
        await removeBook(isbn);
      } catch (error) {
        console.error('Failed to remove book:', error);
      }
    }
  };

  const openUpdateModal = (book: Book) => {
    setSelectedBook(book);
    setUpdateCopies(book.availableCopies);
    setShowUpdateModal(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
        <p className="text-gray-600">Manage library books and stock levels</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-8 flex gap-4 flex-wrap">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> Add New Book
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  ISBN
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                  Stock
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr
                  key={book.isbn}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {book.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {book.isbn}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        book.availableCopies === 0
                          ? 'bg-red-100 text-red-700'
                          : book.availableCopies <= 1
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {book.availableCopies}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => openUpdateModal(book)}
                      className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleRemoveBook(book.isbn)}
                      className="inline-block bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {books.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            No books in inventory yet.
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      <Modal
        isOpen={showAddModal}
        title="Add New Book"
        onClose={() => setShowAddModal(false)}
        size="md"
      >
        <form onSubmit={handleAddBook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              ISBN *
            </label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) =>
                setFormData({ ...formData, isbn: e.target.value })
              }
              placeholder="978-0-123456-78-9"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Book Title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Author *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              placeholder="Author Name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Copies *
              </label>
              <input
                type="number"
                value={formData.availableCopies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableCopies: parseInt(e.target.value) || 1,
                  })
                }
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Year Published
              </label>
              <input
                type="number"
                value={formData.publishedYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publishedYear: parseInt(e.target.value),
                  })
                }
                min="1000"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Book description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Stock Modal */}
      {selectedBook && (
        <Modal
          isOpen={showUpdateModal}
          title={`Update Stock - ${selectedBook.title}`}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedBook(null);
          }}
          size="sm"
        >
          <form onSubmit={handleUpdateStock} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Number of Copies
              </label>
              <input
                type="number"
                value={updateCopies}
                onChange={(e) =>
                  setUpdateCopies(Math.max(0, parseInt(e.target.value) || 0))
                }
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedBook(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Stock'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
