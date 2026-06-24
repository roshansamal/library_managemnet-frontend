import { useEffect, useState } from "react";

import {
  getCopies,
  createCopy,
  updateCopy,
  deleteCopy,
} from "../../services/libraryBookCopies.service";

export default function BookCopies() {
  const [copies, setCopies] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [bookId, setBookId] = useState("");
  const [barcode, setBarcode] = useState("");
  const [status, setStatus] = useState<
    "Available" | "Issued" | "Lost" | "Damaged"
  >("Available");

  useEffect(() => {
    loadCopies();
  }, []);

  const loadCopies = async () => {
    const data = await getCopies();
    setCopies(data);
  };

  const resetForm = () => {
    setEditingId(null);
    setBookId("");
    setBarcode("");
    setStatus("Available");
  };

  const handleAdd = async () => {
    await createCopy({
      book_id: Number(bookId),
      barcode,
      status,
    });

    resetForm();
    loadCopies();
  };

  const handleEdit = (copy: any) => {
    setEditingId(copy.copy_id);
    setBookId(copy.book_id);
    setBarcode(copy.barcode);
    setStatus(copy.status);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    await updateCopy(editingId, {
      book_id: Number(bookId),
      barcode,
      status,
    });

    resetForm();
    loadCopies();
  };

  const handleDelete = async (id: number) => {
    await deleteCopy(id);
    loadCopies();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Book Copies</h1>

      {/* FORM */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <input
          placeholder="Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        />

        <input
          placeholder="Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as
                | "Available"
                | "Issued"
                | "Lost"
                | "Damaged"
            )
          }
        >
          <option value="Available">Available</option>
          <option value="Issued">Issued</option>
          <option value="Lost">Lost</option>
          <option value="Damaged">Damaged</option>
        </select>

        <button onClick={editingId ? handleUpdate : handleAdd}>
          {editingId ? "Update Copy" : "Add Copy"}
        </button>

        {editingId && <button onClick={resetForm}>Cancel</button>}
      </div>

      {/* TABLE */}
      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Book ID</th>
            <th>Barcode</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {copies.map((c) => (
            <tr key={c.copy_id}>
              <td>{c.copy_id}</td>
              <td>{c.book_id}</td>
              <td>{c.barcode}</td>
              <td>{c.status}</td>

              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c.copy_id)}>
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