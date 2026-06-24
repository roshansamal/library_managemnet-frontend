import api from "./api";

export const getIssues = async () => {
  const res = await api.get("/library-issues");
  return res.data;
};

export const getIssueById = async (id: number) => {
  const res = await api.get(`/library-issues/${id}`);
  return res.data;
};

export const createIssue = async (data: any) => {
  const res = await api.post("/library-issues", data);
  return res.data;
};

export const updateIssue = async (id: number, data: any) => {
  const res = await api.put(`/library-issues/${id}`, data);
  return res.data;
};

export const deleteIssue = async (id: number) => {
  const res = await api.delete(`/library-issues/${id}`);
  return res.data;
};