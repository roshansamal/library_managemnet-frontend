import api from "./api";

export interface BookAuthor {
  book_id: number;
  author_id: number;
}

// GET ALL
export const getBookAuthors = async () => {
  const res = await api.get("/library-book-author");
  return res.data;
};

// CREATE
export const createBookAuthor = async (data: BookAuthor) => {
  const res = await api.post("/library-book-author", data);
  return res.data;
};

// GET BY BOOK ID
export const getByBookId = async (bookId: number) => {
  const res = await api.get(`/library-book-author/${bookId}`);
  return res.data;
};

// UPDATE (optional logic)
export const updateBookAuthor = async (bookId: number, data: BookAuthor) => {
  const res = await api.put(`/library-book-author/${bookId}`, data);
  return res.data;
};

// DELETE (by book_id)
export const deleteBookAuthor = async (bookId: number) => {
  const res = await api.delete(`/library-book-author/${bookId}`);
  return res.data;
};