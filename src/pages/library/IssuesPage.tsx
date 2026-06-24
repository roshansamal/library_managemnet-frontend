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
    await deleteIssue(id);
    loadIssues();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Issue Records</h1>

      {/* FORM */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <input
          placeholder="Member ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        />

        <input
          placeholder="Copy ID"
          value={copyId}
          onChange={(e) => setCopyId(e.target.value)}
        />

        <input
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button onClick={editingId ? handleUpdate : handleAdd}>
          {editingId ? "Update Issue" : "Add Issue"}
        </button>

        {editingId && <button onClick={resetForm}>Cancel</button>}
      </div>

      {/* TABLE */}
      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Member ID</th>
            <th>Copy ID</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {issues.map((i) => (
            <tr key={i.issue_id}>
              <td>{i.issue_id}</td>
              <td>{i.member_id}</td>
              <td>{i.copy_id}</td>
              <td>{i.issue_date}</td>
              <td>{i.due_date}</td>

              <td>
                <button onClick={() => handleEdit(i)}>Edit</button>
                <button onClick={() => handleDelete(i.issue_id)}>
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