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
  <div
    style={{
      padding: "30px",
      background: "#f8fafc",
      minHeight: "100vh",
    }}
  >
    <div
      style={{
        background: "linear-gradient(135deg,#dc2626,#ef4444)",
        padding: "25px",
        borderRadius: "15px",
        color: "white",
        marginBottom: "25px",
        boxShadow: "0 10px 25px rgba(239,68,68,0.3)",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        💰 Fine Payments Management
      </h1>

      <p
        style={{
          marginTop: "10px",
          opacity: 0.9,
        }}
      >
        Manage library fine records and payments
      </p>
    </div>

    {/* FORM CARD */}
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "15px",
        marginBottom: "25px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: "#1e293b",
        }}
      >
        {editingId ? "✏️ Update Fine" : "➕ Add New Fine"}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "15px",
        }}
      >
        <input
          placeholder="Return ID"
          value={returnId}
          onChange={(e) => setReturnId(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
          }}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
          }}
        />

        <select
          value={paymentStatus}
          onChange={(e) =>
            setPaymentStatus(
              e.target.value as "Pending" | "Paid"
            )
          }
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
          }}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>

        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
          }}
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
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {editingId ? "Update Fine" : "Add Fine"}
        </button>

        {editingId && (
          <button
            onClick={resetForm}
            style={{
              background: "#64748b",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>

    {/* TABLE CARD */}
    <div
      style={{
        background: "#fff",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#1e293b",
          }}
        >
          Fine Payments List ({fines.length})
        </h2>
      </div>

      <div style={{ overflowX: "auto" }}>
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
              <th style={{ padding: "15px" }}>ID</th>
              <th style={{ padding: "15px" }}>Return ID</th>
              <th style={{ padding: "15px" }}>Amount</th>
              <th style={{ padding: "15px" }}>Status</th>
              <th style={{ padding: "15px" }}>Payment Date</th>
              <th style={{ padding: "15px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {fines.map((f) => (
              <tr
                key={f.fine_id}
                style={{
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <td style={{ padding: "15px" }}>
                  {f.fine_id}
                </td>

                <td style={{ padding: "15px" }}>
                  {f.return_id}
                </td>

                <td
                  style={{
                    padding: "15px",
                    fontWeight: "bold",
                    color: "#dc2626",
                  }}
                >
                  ₹{f.amount}
                </td>

                <td style={{ padding: "15px" }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      background:
                        f.payment_status === "Paid"
                          ? "#dcfce7"
                          : "#fef3c7",
                      color:
                        f.payment_status === "Paid"
                          ? "#166534"
                          : "#92400e",
                      fontWeight: "bold",
                    }}
                  >
                    {f.payment_status}
                  </span>
                </td>

                <td style={{ padding: "15px" }}>
                  {f.payment_date}
                </td>

                <td style={{ padding: "15px" }}>
                  <button
                    onClick={() => handleEdit(f)}
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(f.fine_id)
                    }
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {fines.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#64748b",
                  }}
                >
                  No fine records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}