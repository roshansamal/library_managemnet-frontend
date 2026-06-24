import api from "./api";

export const getReturns = async () => {
  const res = await api.get("/library-returns");
  return res.data;
};

export const getReturnById = async (id: number) => {
  const res = await api.get(`/library-returns/${id}`);
  return res.data;
};

export const createReturn = async (data: any) => {
  const res = await api.post("/library-returns", data);
  return res.data;
};

export const updateReturn = async (id: number, data: any) => {
  const res = await api.put(`/library-returns/${id}`, data);
  return res.data;
};

export const deleteReturn = async (id: number) => {
  const res = await api.delete(`/library-returns/${id}`);
  return res.data;
};