import api from "./api";

export interface Category {
  category_id: number;
  category_name: string;
}

export const getCategories = async () => {
  const response = await api.get("/library-categories");
  return response.data;
};

export const getCategoryById = async (id: number) => {
  const response = await api.get(`/library-categories/${id}`);
  return response.data;
};

export const createCategory = async (
  data: Omit<Category, "category_id">
) => {
  const response = await api.post("/library-categories", data);
  return response.data;
};

export const updateCategory = async (
  id: number,
  data: Partial<Category>
) => {
  const response = await api.put(
    `/library-categories/${id}`,
    data
  );

  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await api.delete(
    `/library-categories/${id}`
  );

  return response.data;
};