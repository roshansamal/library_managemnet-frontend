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
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md p-6 border rounded-lg"
      >
        <h1 className="text-2xl font-bold mb-6">
          Register
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 mb-4"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 mb-4"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-3 mb-4"
          value={repassword}
          onChange={(e) =>
            setRepassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded"
        >
          Register
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}