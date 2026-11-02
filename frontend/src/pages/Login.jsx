
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
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
        "http://localhost:5000/api/auth/login",
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
        throw new Error(data.error || "Login failed.");
      }

      const loggedInUser = await refreshUser();

      if (!loggedInUser || loggedInUser.role !== "user") {
        throw new Error("Unable to verify user session.");
      }

      navigate("/validate");

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b18] text-white">
      <Navbar />

      <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 py-16">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/15 blur-[110px]"></div>

        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111426]/90 p-8 shadow-2xl shadow-purple-950/30 backdrop-blur-xl md:p-10">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-xl font-bold shadow-lg shadow-purple-500/30">
            AI
          </div>

          <h1 className="mt-7 text-center text-3xl font-bold">
            Welcome <span className="text-purple-400">Back</span>
          </h1>

          <p className="mt-3 text-center text-sm leading-6 text-gray-400">
            Login to your AI Startup Validator account.
          </p>

          <form className="mt-9" onSubmit={handleLogin}>

            <label className="text-sm font-medium text-gray-300">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b18] p-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />

            <label className="mt-6 block text-sm font-medium text-gray-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b18] p-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />

            {message && (
              <p className="mt-4 text-center text-sm text-purple-300">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-purple-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login to Account →"}
            </button>

          </form>

          <div className="my-7 border-t border-white/10"></div>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-purple-400 transition hover:text-purple-300"
            >
              Create Account
            </Link>
          </p>

        </div>
      </main>
    </div>
  );
}

export default Login;
