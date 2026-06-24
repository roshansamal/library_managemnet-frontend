import api from "./api";

export interface Publisher {
  publisher_id: number;
  publisher_name: string;
  address: string;
  contact_no: string;
}

export const getPublishers = async () => {
  const response = await api.get("/library-publishers");
  return response.data;
};

export const getPublisherById = async (id: number) => {
  const response = await api.get(`/library-publishers/${id}`);
  return response.data;
};

export const createPublisher = async (
  data: Omit<Publisher, "publisher_id">
) => {
  const response = await api.post(
    "/library-publishers",
    data
  );

  return response.data;
};

export const updatePublisher = async (
  id: number,
  data: Partial<Publisher>
) => {
  const response = await api.put(
    `/library-publishers/${id}`,
    data
  );

  return response.data;
};

export const deletePublisher = async (
  id: number
) => {
  const response = await api.delete(
    `/library-publishers/${id}`
  );

  return response.data;
};