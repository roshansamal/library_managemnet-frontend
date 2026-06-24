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
    await deleteReturn(id);
    loadReturns();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Return Records</h1>

      {/* FORM */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <input
          placeholder="Issue ID"
          value={issueId}
          onChange={(e) => setIssueId(e.target.value)}
        />

        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />

        <select
          value={condition}
          onChange={(e) =>
            setCondition(
              e.target.value as "Good" | "Damaged" | "Lost"
            )
          }
        >
          <option value="Good">Good</option>
          <option value="Damaged">Damaged</option>
          <option value="Lost">Lost</option>
        </select>

        <button onClick={editingId ? handleUpdate : handleAdd}>
          {editingId ? "Update Return" : "Add Return"}
        </button>

        {editingId && <button onClick={resetForm}>Cancel</button>}
      </div>

      {/* TABLE */}
      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Issue ID</th>
            <th>Return Date</th>
            <th>Condition</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {returns.map((r) => (
            <tr key={r.return_id}>
              <td>{r.return_id}</td>
              <td>{r.issue_id}</td>
              <td>{r.return_date}</td>
              <td>{r.condition_status}</td>

              <td>
                <button onClick={() => handleEdit(r)}>Edit</button>
                <button onClick={() => handleDelete(r.return_id)}>
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