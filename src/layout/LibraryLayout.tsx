import { Outlet } from "react-router-dom";
import LibrarySidebar from "../components/layout/LibrarySidebar";

export default function LibraryLayout() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* LEFT SIDEBAR */}
      <LibrarySidebar />

      {/* MAIN CONTENT AREA */}
      <div
        style={{
          marginLeft: "220px",
          padding: "20px",
          width: "100%",
          minHeight: "100vh",
          background: "#f9fafb",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}