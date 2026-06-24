import { useEffect, useState } from "react";

import {
  getReturns,
  createReturn,
  updateReturn,
  deleteReturn,
} from "../../services/libraryReturnRecords.service";

export default function ReturnRecords() {
  const [returns, setReturns] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [issueId, setIssueId] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [condition, setCondition] = useState<
    "Good" | "Damaged" | "Lost"
  >("Good");

  useEffect(() => {
    loadReturns();
  }, []);

  const loadReturns = async () => {
    const data = await getReturns();
    setReturns(data);
  };

  const resetForm = () => {
    setEditingId(null);
    setIssueId("");
    setReturnDate("");
    setCondition("Good");
  };

  const handleAdd = async () => {
    await createReturn({
      issue_id: Number(issueId),
      return_date: returnDate,
      condition_status: condition,
    });

    resetForm();
    loadReturns();
  };

  const handleEdit = (r: any) => {
    setEditingId(r.return_id);
    setIssueId(r.issue_id);
    setReturnDate(r.return_date);
    setCondition(r.condition_status);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    await updateReturn(editingId, {
      issue_id: Number(issueId),
      return_date: returnDate,
      condition_status: condition,
    });

    resetForm();
    loadReturns();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this return record?")) return;

    await deleteReturn(id);
    loadReturns();
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ margin: 0, color: "#1e293b" }}>
          🔄 Return Records Management
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
          }}
        >
          Manage returned books and their condition.
        </p>
      </div>

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
          {editingId ? "✏️ Update Return" : "➕ Add Return Record"}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px",
          }}
        >
          <input
            placeholder="Issue ID"
            value={issueId}
            onChange={(e) => setIssueId(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            style={inputStyle}
          />

          <select
            value={condition}
            onChange={(e) =>
              setCondition(
                e.target.value as "Good" | "Damaged" | "Lost"
              )
            }
            style={inputStyle}
          >
            <option value="Good">Good</option>
            <option value="Damaged">Damaged</option>
            <option value="Lost">Lost</option>
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
            {editingId ? "Update Return" : "Add Return"}
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
          📋 Return Records ({returns.length})
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Issue ID</th>
              <th style={thStyle}>Return Date</th>
              <th style={thStyle}>Condition</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {returns.map((r) => (
              <tr key={r.return_id}>
                <td style={tdStyle}>{r.return_id}</td>
                <td style={tdStyle}>{r.issue_id}</td>
                <td style={tdStyle}>{r.return_date}</td>

                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      color: "#fff",
                      background:
                        r.condition_status === "Good"
                          ? "#16a34a"
                          : r.condition_status === "Damaged"
                          ? "#f59e0b"
                          : "#dc2626",
                    }}
                  >
                    {r.condition_status}
                  </span>
                </td>

                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(r)}
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
                    onClick={() => handleDelete(r.return_id)}
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