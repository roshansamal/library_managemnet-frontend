import api from "./api";

export interface Member {
  member_id: number;
user_id: number | null;
  name: string;
  phone: string;
  address: string;
  join_date: string;
}

export const getMembers = async () => {
  const response = await api.get("/library-members");
  return response.data;
};

export const getMemberById = async (id: number) => {
  const response = await api.get(`/library-members/${id}`);
  return response.data;
};

export const createMember = async (data: Omit<Member, "member_id">) => {
  const response = await api.post("/library-members", data);
  return response.data;
};

export const updateMember = async (
  id: number,
  data: Partial<Member>
) => {
  const response = await api.put(`/library-members/${id}`, data);
  return response.data;
};

export const deleteMember = async (id: number) => {
  const response = await api.delete(`/library-members/${id}`);
  return response.data;
};