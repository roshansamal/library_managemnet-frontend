import { useEffect, useState } from "react";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/libraryUsers.service";

type UserRole = "Admin" | "Librarian" | "Student";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Student");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const resetForm = () => {
    setEditingId(null);
    setUsername("");
    setPassword("");
    setRole("Student");
    setEmail("");
  };

  const handleAdd = async () => {
    await createUser({
      username,
      password,
      role,
      email,
    });

    resetForm();
    loadUsers();
  };

  const handleEdit = (user: any) => {
    setEditingId(user.user_id);
    setUsername(user.username);
    setPassword(user.password);
    setRole(user.role);
    setEmail(user.email);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    await updateUser(editingId, {
      username,
      password,
      role,
      email,
    });

    resetForm();
    loadUsers();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this user?")) {
      await deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#f4f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "15px",
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
          👥 Library Users
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
          }}
        >
          Manage all library users from one place
        </p>
      </div>

      {/* Form Card */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "25px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>
          {editingId ? "✏️ Update User" : "➕ Add New User"}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px",
          }}
        >
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as UserRole)
            }
            style={inputStyle}
          >
            <option value="Admin">Admin</option>
            <option value="Librarian">Librarian</option>
            <option value="Student">Student</option>
          </select>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {editingId ? "Update User" : "Add User"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "10px 18px",
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
          background: "white",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#2563eb",
                color: "white",
              }}
            >
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => (
              <tr
                key={u.user_id}
                style={{
                  background:
                    index % 2 === 0
                      ? "#ffffff"
                      : "#f8fafc",
                }}
              >
                <td style={tdStyle}>{u.user_id}</td>
                <td style={tdStyle}>{u.username}</td>
                <td style={tdStyle}>{u.role}</td>
                <td style={tdStyle}>{u.email}</td>

                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(u)}
                    style={{
                      background: "#f59e0b",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(u.user_id)
                    }
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
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
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
};

const thStyle = {
  padding: "14px",
  textAlign: "left" as const,
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
};