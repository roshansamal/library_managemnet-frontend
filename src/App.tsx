import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import DashboardLayout from "./components/DashboardLayout";
import { DashboardHome } from "./pages/DashboardHome";

import Students from "./pages/admin/Students";
import NewStudentPage from "./pages/admin/NewStudentPage";

// Library Pages
import UsersPage from "./pages/library/UsersPage";
import MembersPage from "./pages/library/MembersPage";
import AuthorsPage from "./pages/library/AuthorsPage";
import PublishersPage from "./pages/library/PublishersPage";
import CategoriesPage from "./pages/library/CategoriesPage";
import BooksPage from "./pages/library/BooksPage";
import BookCopiesPage from "./pages/library/BookCopiesPage";
import BookAuthorsPage from "./pages/library/BookAuthorsPage";
import IssuesPage from "./pages/library/IssuesPage";
import ReturnsPage from "./pages/library/ReturnsPage";
import FinesPage from "./pages/library/FinesPage";

export default function App() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/login"
        element={
          token ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      <Route
        path="/register"
        element={
          token ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />

      {/* Protected Routes */}

      <Route
        path="/"
        element={
          token ? (
            <DashboardLayout onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        {/* Default Route */}

        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Dashboard */}

        <Route
          path="dashboard"
          element={<DashboardHome />}
        />

        {/* Existing Admin Routes */}

        <Route
          path="admin/students"
          element={<Students />}
        />

        <Route
          path="admin/newstudent"
          element={
            <NewStudentPage
              isOpen={true}
              onClose={() => {}}
              initialData={null}
            />
          }
        />

        {/* Library Routes */}

        <Route
          path="library/users"
          element={<UsersPage />}
        />

        <Route
          path="library/members"
          element={<MembersPage />}
        />

        <Route
          path="library/authors"
          element={<AuthorsPage />}
        />

        <Route
          path="library/publishers"
          element={<PublishersPage />}
        />

        <Route
          path="library/categories"
          element={<CategoriesPage />}
        />

        <Route
          path="library/books"
          element={<BooksPage />}
        />

        <Route
          path="library/book-copies"
          element={<BookCopiesPage />}
        />

        <Route
          path="library/book-authors"
          element={<BookAuthorsPage />}
        />

        <Route
          path="library/issues"
          element={<IssuesPage />}
        />

        <Route
          path="library/returns"
          element={<ReturnsPage />}
        />

        <Route
          path="library/fines"
          element={<FinesPage />}
        />
      </Route>

      {/* Fallback Route */}

      <Route
        path="*"
        element={
          <Navigate
            to={token ? "/dashboard" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}