import { useEffect, useState } from "react";
import api from "../services/api";

export const useLibraryCounts = () => {
  const [counts, setCounts] = useState({
    users: 0,
    books: 0,
    copies: 0,
    issues: 0,
    returns: 0,
    fines: 0,
  });

  const load = async () => {
    try {
      const [users, books, copies, issues, returns, fines] =
        await Promise.all([
          api.get("/library-users"),
          api.get("/library-books"),
          api.get("/library-book-copies"),
          api.get("/library-issues"),
          api.get("/library-returns"),
          api.get("/library-fines"),
        ]);

      setCounts({
        users: users.data.length,
        books: books.data.length,
        copies: copies.data.length,
        issues: issues.data.length,
        returns: returns.data.length,
        fines: fines.data.length,
      });
    } catch (err) {
      console.error("Count load error:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return counts;
};