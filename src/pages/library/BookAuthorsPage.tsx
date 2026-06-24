import { useEffect, useState } from "react";

import {
  getBookAuthors,
  createBookAuthor,
  deleteBookAuthor,
} from "../../services/libraryBookAuthors.service";

export default function BookAuthor() {
  const [records, setRecords] = useState<any[]>([]);

  const [bookId, setBookId] = useState("");
  const [authorId, setAuthorId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getBookAuthors();
    setRecords(data);
  };

  const resetForm = () => {
    setBookId("");
    setAuthorId("");
  };

  const handleAdd = async () => {
    await createBookAuthor({
      book_id: Number(bookId),
      author_id: Number(authorId),
    });

    resetForm();
    loadData();
  };

  const handleDelete = async (bookId: number) => {
    await deleteBookAuthor(bookId);
    loadData();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Book Authors</h1>

      {/* FORM */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        />

        <input
          placeholder="Author ID"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        />

        <button onClick={handleAdd}>Add Mapping</button>

        <button onClick={resetForm}>Clear</button>
      </div>

      {/* TABLE */}
      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Author ID</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r, index) => (
            <tr key={index}>
              <td>{r.book_id}</td>
              <td>{r.author_id}</td>

              <td>
                <button onClick={() => handleDelete(r.book_id)}>
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