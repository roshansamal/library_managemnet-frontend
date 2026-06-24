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
    await deleteBook(id);
    loadBooks();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Books</h1>

      {/* FORM */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />

        <input
          placeholder="Category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />

        <input
          placeholder="Publisher ID"
          value={publisherId}
          onChange={(e) => setPublisherId(e.target.value)}
        />

        <input
          placeholder="Publication Year"
          value={publicationYear}
          onChange={(e) => setPublicationYear(e.target.value)}
        />

        <button onClick={editingId ? handleUpdate : handleAdd}>
          {editingId ? "Update Book" : "Add Book"}
        </button>

        {editingId && <button onClick={resetForm}>Cancel</button>}
      </div>

      {/* TABLE */}
      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>ISBN</th>
            <th>Category ID</th>
            <th>Publisher ID</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.map((b) => (
            <tr key={b.book_id}>
              <td>{b.book_id}</td>
              <td>{b.title}</td>
              <td>{b.isbn}</td>
              <td>{b.category_id}</td>
              <td>{b.publisher_id}</td>
              <td>{b.publication_year}</td>

              <td>
                <button onClick={() => handleEdit(b)}>Edit</button>
                <button onClick={() => handleDelete(b.book_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}