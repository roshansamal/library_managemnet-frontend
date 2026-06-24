import { useEffect, useState } from "react";

import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../services/libraryAuthors.service";

export default function Authors() {
  const [authors, setAuthors] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [authorName, setAuthorName] = useState("");
  const [nationality, setNationality] = useState("");

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      const data = await getAuthors();
      setAuthors(data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setAuthorName("");
    setNationality("");
  };

  const handleAdd = async () => {
    try {
      await createAuthor({
        author_name: authorName,
        nationality,
      });

      resetForm();
      loadAuthors();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (author: any) => {
    setEditingId(author.author_id);

    setAuthorName(author.author_name);
    setNationality(author.nationality);
  };

  const handleUpdate = async () => {
    try {
      if (!editingId) return;

      await updateAuthor(editingId, {
        author_name: authorName,
        nationality,
      });

      resetForm();
      loadAuthors();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Delete this author?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAuthor(id);
      loadAuthors();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Library Authors</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          placeholder="Author Name"
          value={authorName}
          onChange={(e) =>
            setAuthorName(e.target.value)
          }
        />

        <input
          placeholder="Nationality"
          value={nationality}
          onChange={(e) =>
            setNationality(e.target.value)
          }
        />

        <button
          onClick={
            editingId ? handleUpdate : handleAdd
          }
        >
          {editingId
            ? "Update Author"
            : "Add Author"}
        </button>

        {editingId && (
          <button onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      <table
        border={1}
        cellPadding={10}
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Author Name</th>
            <th>Nationality</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {authors.map((author) => (
            <tr key={author.author_id}>
              <td>{author.author_id}</td>

              <td>{author.author_name}</td>

              <td>{author.nationality}</td>

              <td>
                <button
                  onClick={() =>
                    handleEdit(author)
                  }
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(author.author_id)
                  }
                >
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