import { useEffect, useState } from "react";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../../services/libraryMembers.service";

export default function Members() {
  const [members, setMembers] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      console.error("Failed to load members:", error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPhone("");
    setAddress("");
  };

  const handleAdd = async () => {
    try {
      await createMember({
        user_id: null,
        name,
        phone,
        address,
        join_date: new Date().toISOString().split("T")[0],
      });

      resetForm();
      loadMembers();
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  const handleEdit = (member: any) => {
    setEditingId(member.member_id);

    setName(member.name);
    setPhone(member.phone);
    setAddress(member.address);
  };

  const handleUpdate = async () => {
    try {
      if (!editingId) return;

      await updateMember(editingId, {
        name,
        phone,
        address,
      });

      resetForm();
      loadMembers();
    } catch (error) {
      console.error("Failed to update member:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) return;

    try {
      await deleteMember(id);
      loadMembers();
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Library Members</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          onClick={editingId ? handleUpdate : handleAdd}
        >
          {editingId ? "Update Member" : "Add Member"}
        </button>

        {editingId && (
          <button onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      <table
        border={1}
        cellPadding={10}
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <tr key={member.member_id}>
              <td>{member.member_id}</td>
              <td>{member.name}</td>
              <td>{member.phone}</td>
              <td>{member.address}</td>
              <td>{member.join_date}</td>

              <td>
                <button
                  onClick={() => handleEdit(member)}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(member.member_id)
                  }
                >
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