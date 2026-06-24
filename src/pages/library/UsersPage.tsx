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
    await deleteUser(id);
    loadUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Library Users</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🔥 FIXED HERE */}
        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value as UserRole)
          }
        >
          <option value="Admin">Admin</option>
          <option value="Librarian">Librarian</option>
          <option value="Student">Student</option>
        </select>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={editingId ? handleUpdate : handleAdd}>
          {editingId ? "Update User" : "Add User"}
        </button>

        {editingId && <button onClick={resetForm}>Cancel</button>}
      </div>

      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.user_id}>
              <td>{u.user_id}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.email}</td>

              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u.user_id)}>
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