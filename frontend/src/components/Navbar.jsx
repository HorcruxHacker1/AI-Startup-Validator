
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const navLinkClass = (path) =>
    `transition-colors duration-200 ${
      location.pathname === path
        ? "text-purple-400"
        : "text-gray-300 hover:text-purple-400"
    }`;

  const handleLogout = async () => {
    try {
      await logout();
      navigate(user?.role === "admin" ? "/admin-login" : "/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080b18]/90 px-6 py-5 shadow-lg shadow-purple-950/10 backdrop-blur-xl md:px-10">

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">

        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-purple-500/30 transition-transform group-hover:scale-105">
            AI
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            Startup <span className="text-purple-400">Validator</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-5 text-sm font-medium">

          <Link to="/" className={navLinkClass("/")}>
            Home
          </Link>

          {!user && (
            <>
              <Link to="/login" className={navLinkClass("/login")}>
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:scale-105 hover:shadow-purple-500/40"
              >
                Get Started
              </Link>

              <Link
                to="/admin-login"
                className={navLinkClass("/admin-login")}
              >
                Admin Login
              </Link>
            </>
          )}

          {user?.role === "user" && (
            <>
              <Link to="/validate" className={navLinkClass("/validate")}>
                Validate Idea
              </Link>

              <span className="text-gray-400">
                Hi, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-purple-500/40 px-4 py-2 text-purple-300 transition hover:bg-purple-500/10"
              >
                Logout
              </button>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link
                to="/admin-dashboard"
                className={navLinkClass("/admin-dashboard")}
              >
                Admin Dashboard
              </Link>

              <span className="text-gray-400">
                Administrator
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-purple-500/40 px-4 py-2 text-purple-300 transition hover:bg-purple-500/10"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
