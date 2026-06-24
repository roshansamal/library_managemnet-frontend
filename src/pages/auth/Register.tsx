import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/auth.service";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await registerUser(
        username,
        email,
        password,
        repassword
      );

      alert("Registration successful");

      navigate("/login");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
  <div
    className="min-h-screen flex items-center justify-center px-4"
    style={{
      background:
        "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
    }}
  >
    <div
      className="w-full max-w-md"
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "35px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
      }}
    >
      <div className="text-center mb-8">
        <div
          style={{
            fontSize: "50px",
            marginBottom: "10px",
          }}
        >
          📚
        </div>

        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#1e293b",
            marginBottom: "10px",
          }}
        >
          Create Account
        </h1>

        <p
          style={{
            color: "#64748b",
          }}
        >
          Library Management System
        </p>
      </div>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="w-full mb-4"
          style={{
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            outline: "none",
          }}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full mb-4"
          style={{
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            outline: "none",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full mb-4"
          style={{
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            outline: "none",
          }}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={repassword}
          onChange={(e) =>
            setRepassword(e.target.value)
          }
          className="w-full mb-6"
          style={{
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            outline: "none",
          }}
        />

        <button
          type="submit"
          className="w-full"
          style={{
            background:
              "linear-gradient(135deg,#16a34a,#22c55e)",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Register
        </button>

        <p
          className="text-center mt-6"
          style={{
            color: "#64748b",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  </div>
);
}