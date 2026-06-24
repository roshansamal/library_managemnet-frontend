import api from "./api";

export interface Author {
  author_id: number;
  author_name: string;
  nationality: string;
}

export const getAuthors = async () => {
  const response = await api.get("/library-authors");
  return response.data;
};

export const getAuthorById = async (id: number) => {
  const response = await api.get(`/library-authors/${id}`);
  return response.data;
};

export const createAuthor = async (
  data: Omit<Author, "author_id">
) => {
  const response = await api.post("/library-authors", data);
  return response.data;
};

export const updateAuthor = async (
  id: number,
  data: Partial<Author>
) => {
  const response = await api.put(`/library-authors/${id}`, data);
  return response.data;
};

export const deleteAuthor = async (id: number) => {
  const response = await api.delete(`/library-authors/${id}`);
  return response.data;
};