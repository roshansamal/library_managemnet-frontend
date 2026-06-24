import { useEffect, useState } from "react";

import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../../services/libraryBooks.service";

export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const [publicationYear, setPublicationYear] = useState("");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const data = await getBooks();
    setBooks(data);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setIsbn("");
    setCategoryId("");
    setPublisherId("");
    setPublicationYear("");
  };

  const handleAdd = async () => {
    await createBook({
      title,
      isbn,
      category_id: Number(categoryId),
      publisher_id: Number(publisherId),
      publication_year: Number(publicationYear),
    });

    resetForm();
    loadBooks();
  };

  const handleEdit = (book: any) => {
    setEditingId(book.book_id);
    setTitle(book.title);
    setIsbn(book.isbn);
    setCategoryId(book.category_id);
    setPublisherId(book.publisher_id);
    setPublicationYear(book.publication_year);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    await updateBook(editingId, {
      title,
      isbn,
      category_id: Number(categoryId),
      publisher_id: Number(publisherId),
      publication_year: Number(publicationYear),
    });

    resetForm();
    loadBooks();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this book?")) return;

    await deleteBook(id);
    loadBooks();
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#1e293b",
          }}
        >
          📚 Books Management
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
          }}
        >
          Manage all library books from one place
        </p>
      </div>

      {/* Form Card */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "25px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          {editingId ? "✏️ Update Book" : "➕ Add New Book"}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px",
          }}
        >
          <input
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Category ID"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Publisher ID"
            value={publisherId}
            onChange={(e) => setPublisherId(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Publication Year"
            value={publicationYear}
            onChange={(e) => setPublicationYear(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={editingId ? handleUpdate : handleAdd}
            style={{
              background: editingId ? "#f59e0b" : "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {editingId ? "Update Book" : "Add Book"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <h2 style={{ margin: 0 }}>
            📖 Total Books: {books.length}
          </h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#2563eb",
                  color: "white",
                }}
              >
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>ISBN</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Publisher</th>
                <th style={thStyle}>Year</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((b) => (
                <tr key={b.book_id}>
                  <td style={tdStyle}>{b.book_id}</td>
                  <td style={tdStyle}>{b.title}</td>
                  <td style={tdStyle}>{b.isbn}</td>
                  <td style={tdStyle}>{b.category_id}</td>
                  <td style={tdStyle}>{b.publisher_id}</td>
                  <td style={tdStyle}>{b.publication_year}</td>

                  <td style={tdStyle}>
                    <button
                      onClick={() => handleEdit(b)}
                      style={{
                        background: "#f59e0b",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        marginRight: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(b.book_id)}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {books.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#64748b",
                    }}
                  >
                    No books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "14px",
};

const thStyle = {
  padding: "14px",
  textAlign: "left" as const,
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e2e8f0",
};