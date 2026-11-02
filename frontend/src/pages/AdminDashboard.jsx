
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    total_ideas: 0,
    total_analyses: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/summary",
          {
            credentials: "include"
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          navigate("/admin-login");
          return;
        }

        if (response.status === 403) {
          setError("Administrator access required.");
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Unable to load dashboard.");
        }

        setStats(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const cards = [
    {
      title: "Total Users",
      value: stats.total_users,
      icon: "👥"
    },
    {
      title: "Startup Ideas",
      value: stats.total_ideas,
      icon: "💡"
    },
    {
      title: "AI Analyses",
      value: stats.total_analyses,
      icon: "📊"
    }
  ];

  return (
    <div className="min-h-screen bg-[#080b18] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-purple-400">
            ADMINISTRATION
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-400">
            Monitor your AI Startup Validator platform.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-400">
            Loading dashboard...
          </p>
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-purple-500/20 bg-[#111629] p-7 shadow-lg shadow-purple-900/10"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-gray-400">
                    {card.title}
                  </h2>

                  <span className="text-3xl">
                    {card.icon}
                  </span>
                </div>

                <p className="text-4xl font-bold">
                  {card.value}
                </p>
              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;
