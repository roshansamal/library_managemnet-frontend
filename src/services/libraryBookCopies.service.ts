import api from "./api";

export interface BookCopy {
  copy_id: number;
  book_id: number;
  barcode: string;
  status: "Available" | "Issued" | "Lost" | "Damaged";
}

// GET ALL
export const getCopies = async () => {
  const res = await api.get("/library-book-copies");
  return res.data;
};

// GET BY ID
export const getCopyById = async (id: number) => {
  const res = await api.get(`/library-book-copies/${id}`);
  return res.data;
};

// CREATE
export const createCopy = async (data: Omit<BookCopy, "copy_id">) => {
  const res = await api.post("/library-book-copies", data);
  return res.data;
};

// UPDATE
export const updateCopy = async (id: number, data: Partial<BookCopy>) => {
  const res = await api.put(`/library-book-copies/${id}`, data);
  return res.data;
};

// DELETE
export const deleteCopy = async (id: number) => {
  const res = await api.delete(`/library-book-copies/${id}`);
  return res.data;
};