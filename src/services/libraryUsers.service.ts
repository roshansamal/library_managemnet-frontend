import api from "./api";

export interface User {
  user_id: number;
  username: string;
  password: string;
  role: "Admin" | "Librarian" | "Student";
  email: string;
}

// GET ALL
export const getUsers = async () => {
  const res = await api.get("/library-users");
  return res.data;
};

// GET BY ID
export const getUserById = async (id: number) => {
  const res = await api.get(`/library-users/${id}`);
  return res.data;
};

// CREATE
export const createUser = async (data: Omit<User, "user_id">) => {
  const res = await api.post("/library-users", data);
  return res.data;
};

// UPDATE
export const updateUser = async (
  id: number,
  data: Partial<User>
) => {
  const res = await api.put(`/library-users/${id}`, data);
  return res.data;
};

// DELETE
export const deleteUser = async (id: number) => {
  const res = await api.delete(`/library-users/${id}`);
  return res.data;
};