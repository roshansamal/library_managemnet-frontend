import api from "./api";

export interface Book {
  book_id: number;
  title: string;
  isbn: string;
  category_id: number;
  publisher_id: number;
  publication_year: number;
}

// GET ALL
export const getBooks = async () => {
  const res = await api.get("/library-books");
  return res.data;
};

// GET BY ID
export const getBookById = async (id: number) => {
  const res = await api.get(`/library-books/${id}`);
  return res.data;
};

// CREATE
export const createBook = async (data: Omit<Book, "book_id">) => {
  const res = await api.post("/library-books", data);
  return res.data;
};

// UPDATE
export const updateBook = async (id: number, data: Partial<Book>) => {
  const res = await api.put(`/library-books/${id}`, data);
  return res.data;
};

// DELETE
export const deleteBook = async (id: number) => {
  const res = await api.delete(`/library-books/${id}`);
  return res.data;
};