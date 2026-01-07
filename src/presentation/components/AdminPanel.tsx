import React, { useState } from "react";
import { useLibrary } from "../contexts/LibraryContext";
import "./AdminPanel.css";

export const AdminPanel: React.FC = () => {
  const { addBook, updateBookStock, books } = useLibrary();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedIsbn, setSelectedIsbn] = useState("");

  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    availableCopies: 1,
    description: "",
    publishedYear: new Date().getFullYear(),
  });

  const [updateCopies, setUpdateCopies] = useState(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "availableCopies" || name === "publishedYear"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBook(formData);
    setFormData({
      isbn: "",
      title: "",
      author: "",
      availableCopies: 1,
      description: "",
      publishedYear: new Date().getFullYear(),
    });
    setShowAddForm(false);
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIsbn) {
      await updateBookStock(selectedIsbn, updateCopies);
      setShowUpdateForm(false);
      setSelectedIsbn("");
      setUpdateCopies(0);
    }
  };

  const openUpdateForm = (isbn: string, currentCopies: number) => {
    setSelectedIsbn(isbn);
    setUpdateCopies(currentCopies);
    setShowUpdateForm(true);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>🛠️ Admin Panel</h2>
        <p>Manage library inventory and book stock</p>
      </div>

      <div className="admin-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "+ Add New Book"}
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-container">
          <h3>Add New Book</h3>
          <form onSubmit={handleAddBook} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="isbn">ISBN *</label>
                <input
                  id="isbn"
                  name="isbn"
                  type="text"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  required
                  placeholder="978-0-123456-78-9"
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Book Title"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="author">Author *</label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  placeholder="Author Name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="availableCopies">Copies *</label>
                <input
                  id="availableCopies"
                  name="availableCopies"
                  type="number"
                  min="0"
                  value={formData.availableCopies}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="publishedYear">Year</label>
                <input
                  id="publishedYear"
                  name="publishedYear"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={formData.publishedYear}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Book description..."
              />
            </div>

            <button type="submit" className="btn btn-success">
              Add Book
            </button>
          </form>
        </div>
      )}

      {showUpdateForm && (
        <div className="admin-form-container">
          <h3>Update Book Stock</h3>
          <form onSubmit={handleUpdateStock} className="admin-form">
            <div className="form-group">
              <label htmlFor="updateCopies">Number of Copies</label>
              <input
                id="updateCopies"
                type="number"
                min="0"
                value={updateCopies}
                onChange={(e) => setUpdateCopies(parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                Update Stock
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowUpdateForm(false);
                  setSelectedIsbn("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-inventory">
        <h3>Current Inventory</h3>
        <div className="inventory-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.isbn}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.isbn}</td>
                  <td>
                    <span
                      className={`stock-indicator ${
                        book.availableCopies === 0 ? "low" : ""
                      }`}
                    >
                      {book.availableCopies}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-small"
                      onClick={() =>
                        openUpdateForm(book.isbn, book.availableCopies)
                      }
                    >
                      Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
