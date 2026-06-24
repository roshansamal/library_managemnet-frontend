import { useEffect, useState } from "react";

import {
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue,
} from "../../services/libraryIssueRecords.service";

export default function IssueRecords() {
  const [issues, setIssues] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [memberId, setMemberId] = useState("");
  const [copyId, setCopyId] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    const data = await getIssues();
    setIssues(data);
  };

  const resetForm = () => {
    setEditingId(null);
    setMemberId("");
    setCopyId("");
    setIssueDate("");
    setDueDate("");
  };

  const handleAdd = async () => {
    await createIssue({
      member_id: Number(memberId),
      copy_id: Number(copyId),
      issue_date: issueDate,
      due_date: dueDate,
    });

    resetForm();
    loadIssues();
  };

  const handleEdit = (issue: any) => {
    setEditingId(issue.issue_id);
    setMemberId(issue.member_id);
    setCopyId(issue.copy_id);
    setIssueDate(issue.issue_date);
    setDueDate(issue.due_date);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    await updateIssue(editingId, {
      member_id: Number(memberId),
      copy_id: Number(copyId),
      issue_date: issueDate,
      due_date: dueDate,
    });

    resetForm();
    loadIssues();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this issue record?")) return;

    await deleteIssue(id);
    loadIssues();
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
        <h1 style={{ margin: 0, color: "#1e293b" }}>
          📚 Issue Records Management
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
          }}
        >
          Manage all issued books and due dates.
        </p>
      </div>

      {/* Form */}
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
          {editingId ? "✏️ Update Issue" : "➕ Add New Issue"}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px",
          }}
        >
          <input
            placeholder="Member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Copy ID"
            value={copyId}
            onChange={(e) => setCopyId(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
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
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {editingId ? "Update Issue" : "Add Issue"}
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

      {/* Table */}
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
          📋 All Issue Records ({issues.length})
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
              <th style={thStyle}>Member ID</th>
              <th style={thStyle}>Copy ID</th>
              <th style={thStyle}>Issue Date</th>
              <th style={thStyle}>Due Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((i) => (
              <tr key={i.issue_id}>
                <td style={tdStyle}>{i.issue_id}</td>
                <td style={tdStyle}>{i.member_id}</td>
                <td style={tdStyle}>{i.copy_id}</td>
                <td style={tdStyle}>{i.issue_date}</td>
                <td style={tdStyle}>{i.due_date}</td>

                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(i)}
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
                    onClick={() => handleDelete(i.issue_id)}
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