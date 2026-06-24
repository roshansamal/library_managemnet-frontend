import api from "./api";

export const getFines = async () => {
  const res = await api.get("/library-fines");
  return res.data;
};

export const getFineById = async (id: number) => {
  const res = await api.get(`/library-fines/${id}`);
  return res.data;
};

export const createFine = async (data: any) => {
  const res = await api.post("/library-fines", data);
  return res.data;
};

export const updateFine = async (id: number, data: any) => {
  const res = await api.put(`/library-fines/${id}`, data);
  return res.data;
};

export const deleteFine = async (id: number) => {
  const res = await api.delete(`/library-fines/${id}`);
  return res.data;
};