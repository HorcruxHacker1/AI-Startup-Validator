
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/me",
        {
          credentials: "include"
        }
      );

      if (!response.ok) {
        setUser(null);
        return null;
      }

      const data = await response.json();

      setUser(data);
      return data;

    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      await refreshUser();
      setLoading(false);
    };

    checkSession();
  }, []);

  const logout = async () => {
    const csrfResponse = await fetch(
      "http://localhost:5000/api/csrf-token",
      {
        credentials: "include"
      }
    );

    if (!csrfResponse.ok) {
      throw new Error("Unable to start secure logout.");
    }

    const csrfData = await csrfResponse.json();

    const response = await fetch(
      "http://localhost:5000/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfData.csrf_token
        }
      }
    );

    if (!response.ok) {
      throw new Error("Logout failed.");
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
