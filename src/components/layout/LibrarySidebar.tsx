import { Link } from "react-router-dom";

export default function LibrarySidebar() {
  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "#1f2937",
        color: "white",
        padding: "20px",
        position: "fixed",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Library System</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link to="/library/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/library/users" style={linkStyle}>Users</Link>
        <Link to="/library/publishers" style={linkStyle}>Publishers</Link>
        <Link to="/library/books" style={linkStyle}>Books</Link>
        <Link to="/library/book-copies" style={linkStyle}>Book Copies</Link>
        <Link to="/library/issue-records" style={linkStyle}>Issue Records</Link>
        <Link to="/library/return-records" style={linkStyle}>Return Records</Link>
        <Link to="/library/fine-payments" style={linkStyle}>Fine Payments</Link>
        <Link to="/library/book-author" style={linkStyle}>Book Authors</Link>
      </nav>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "8px",
  borderRadius: "5px",
  background: "#374151",
};