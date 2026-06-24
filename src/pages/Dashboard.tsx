import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [users, setUsers] = useState(0);
  const [books, setBooks] = useState(0);
  const [copies, setCopies] = useState(0);
  const [issues, setIssues] = useState(0);
  const [returns, setReturns] = useState(0);
  const [fines, setFines] = useState(0);

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const usersRes = await api.get("/library-users");
      const booksRes = await api.get("/library-books");
      const copiesRes = await api.get("/library-book-copies");
      const issuesRes = await api.get("/library-issue-records");
      const returnsRes = await api.get("/library-return-records");
      const finesRes = await api.get("/library-fine-payments");

      setUsers(usersRes.data.length);
      setBooks(booksRes.data.length);
      setCopies(copiesRes.data.length);
      setIssues(issuesRes.data.length);
      setReturns(returnsRes.data.length);
      setFines(finesRes.data.length);
    } catch (error) {
      console.error("Dashboard load error:", error);
    }
  };

  const cardStyle = {
    background: "#f3f4f6",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center" as const,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "20px",
  };

  return (
    <div>
      <h1>📊 Library Dashboard</h1>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <h2>Users</h2>
          <h3>{users}</h3>
        </div>

        <div style={cardStyle}>
          <h2>Books</h2>
          <h3>{books}</h3>
        </div>

        <div style={cardStyle}>
          <h2>Book Copies</h2>
          <h3>{copies}</h3>
        </div>

        <div style={cardStyle}>
          <h2>Issued Books</h2>
          <h3>{issues}</h3>
        </div>

        <div style={cardStyle}>
          <h2>Returns</h2>
          <h3>{returns}</h3>
        </div>

        <div style={cardStyle}>
          <h2>Fines</h2>
          <h3>{fines}</h3>
        </div>
      </div>
    </div>
  );
}