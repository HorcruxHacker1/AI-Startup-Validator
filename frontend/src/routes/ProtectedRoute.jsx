
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b18] text-white">
        Checking your session...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={allowedRole === "admin" ? "/admin-login" : "/login"}
        replace
      />
    );
  }

  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin-dashboard" : "/"}
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
