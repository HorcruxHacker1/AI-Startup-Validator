
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const csrfResponse = await fetch(
        "http://localhost:5000/api/csrf-token",
        { credentials: "include" }
      );

      if (!csrfResponse.ok) {
        throw new Error("Unable to start secure login.");
      }

      const csrfData = await csrfResponse.json();

      const response = await fetch(
        "http://localhost:5000/api/auth/admin-login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfData.csrf_token
          },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Admin login failed.");
      }

      const loggedInUser = await refreshUser();

      if (!loggedInUser || loggedInUser.role !== "admin") {
        throw new Error("Unable to verify administrator session.");
      }

      navigate("/admin-dashboard");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b18] text-white">
      <Navbar />

      <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">

        <div className="w-full max-w-md rounded-2xl border border-purple-500/20 bg-[#111629] p-8 shadow-2xl shadow-purple-900/10">

          <div className="mb-7 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/15 text-3xl">
              🛡️
            </div>

            <h1 className="text-3xl font-bold">
              Admin Login
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Secure administrator access
            </p>

          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Administrator Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder="Enter admin email"
                className="w-full rounded-xl border border-gray-700 bg-[#080b18] px-4 py-3 text-white outline-none transition focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter admin password"
                className="w-full rounded-xl border border-gray-700 bg-[#080b18] px-4 py-3 text-white outline-none transition focus:border-purple-500"
              />
            </div>

            {message && (
              <p className="rounded-lg bg-purple-500/10 p-3 text-sm text-purple-300">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-semibold transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login as Administrator"}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <Link to="/login" className="text-purple-400 hover:text-purple-300">
              Return to User Login
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminLogin;
