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
    if (!window.confirm("Delete this copy?")) return;

    await deleteCopy(id);
    loadCopies();
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
          background: "#fff",
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
          📦 Book Copies Management
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
          }}
        >
          Manage all book copies and their availability.
        </p>
      </div>

      {/* Form Card */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>
          {editingId ? "✏️ Update Copy" : "➕ Add New Copy"}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px",
          }}
        >
          <input
            placeholder="Book ID"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            style={inputStyle}
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
            style={inputStyle}
          >
            <option value="Available">Available</option>
            <option value="Issued">Issued</option>
            <option value="Lost">Lost</option>
            <option value="Damaged">Damaged</option>
          </select>
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
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {editingId ? "Update Copy" : "Add Copy"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              style={{
                background: "#64748b",
                color: "#fff",
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
          background: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          overflowX: "auto",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>
          📋 All Book Copies ({copies.length})
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f1f5f9",
              }}
            >
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Book ID</th>
              <th style={thStyle}>Barcode</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {copies.map((c) => (
              <tr key={c.copy_id}>
                <td style={tdStyle}>{c.copy_id}</td>
                <td style={tdStyle}>{c.book_id}</td>
                <td style={tdStyle}>{c.barcode}</td>

                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      color: "white",
                      background:
                        c.status === "Available"
                          ? "#16a34a"
                          : c.status === "Issued"
                          ? "#2563eb"
                          : c.status === "Damaged"
                          ? "#f59e0b"
                          : "#dc2626",
                    }}
                  >
                    {c.status}
                  </span>
                </td>

                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(c)}
                    style={{
                      background: "#f59e0b",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(c.copy_id)}
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  outline: "none",
};

const thStyle = {
  padding: "12px",
  textAlign: "left" as const,
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e2e8f0",
};