import { useEffect, useState } from "react";

import {
  getFines,
  createFine,
  updateFine,
  deleteFine,
} from "../../services/libraryFinePayments.service";

export default function FinePayments() {
  const [fines, setFines] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [returnId, setReturnId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "Pending" | "Paid"
  >("Pending");

  const [paymentDate, setPaymentDate] = useState("");

  useEffect(() => {
    loadFines();
  }, []);

  const loadFines = async () => {
    const data = await getFines();
    setFines(data);
  };

  const resetForm = () => {
    setEditingId(null);
    setReturnId("");
    setAmount("");
    setPaymentStatus("Pending");
    setPaymentDate("");
  };

  const handleAdd = async () => {
    await createFine({
      return_id: Number(returnId),
      amount: Number(amount),
      payment_status: paymentStatus,
      payment_date: paymentDate,
    });

    resetForm();
    loadFines();
  };

  const handleEdit = (f: any) => {
    setEditingId(f.fine_id);
    setReturnId(f.return_id);
    setAmount(f.amount);
    setPaymentStatus(f.payment_status);
    setPaymentDate(f.payment_date);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    await updateFine(editingId, {
      return_id: Number(returnId),
      amount: Number(amount),
      payment_status: paymentStatus,
      payment_date: paymentDate,
    });

    resetForm();
    loadFines();
  };

  const handleDelete = async (id: number) => {
    await deleteFine(id);
    loadFines();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Fine Payments</h1>

      {/* FORM */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <input
          placeholder="Return ID"
          value={returnId}
          onChange={(e) => setReturnId(e.target.value)}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={paymentStatus}
          onChange={(e) =>
            setPaymentStatus(e.target.value as "Pending" | "Paid")
          }
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>

        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />

        <button onClick={editingId ? handleUpdate : handleAdd}>
          {editingId ? "Update Fine" : "Add Fine"}
        </button>

        {editingId && <button onClick={resetForm}>Cancel</button>}
      </div>

      {/* TABLE */}
      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Return ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Payment Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {fines.map((f) => (
            <tr key={f.fine_id}>
              <td>{f.fine_id}</td>
              <td>{f.return_id}</td>
              <td>{f.amount}</td>
              <td>{f.payment_status}</td>
              <td>{f.payment_date}</td>

              <td>
                <button onClick={() => handleEdit(f)}>Edit</button>
                <button onClick={() => handleDelete(f.fine_id)}>
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