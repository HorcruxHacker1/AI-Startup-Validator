
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ValidateIdea() {
  const navigate = useNavigate();

  const [idea, setIdea] = useState("");
  const [message, setMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [viabilityScore, setViabilityScore] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!idea.trim()) {
      setMessage("Please enter your startup idea first.");
      setShowResults(false);
      setAnalysis(null);
      setViabilityScore(0);
      return;
    }

    try {
      setLoading(true);
      setMessage("Gemini AI is analyzing your startup idea...");
      setShowResults(false);
      setAnalysis(null);
      setViabilityScore(0);

      // Obtain a CSRF token.
      const csrfResponse = await fetch(
        "http://localhost:5000/api/csrf-token",
        { credentials: "include" }
      );

      if (!csrfResponse.ok) {
        throw new Error("Unable to establish a secure connection.");
      }

      const csrfData = await csrfResponse.json();

      // Request private AI analysis.
      const response = await fetch(
        "http://localhost:5000/api/analyze",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfData.csrf_token
          },
          body: JSON.stringify({ idea })
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setAnalysis(data.analysis);
      setViabilityScore(data.analysis.viability_score);
      setMessage("Your startup idea was analyzed successfully!");
      setShowResults(true);

    } catch (error) {
      console.error("Analysis Error:", error);
      setMessage(error.message || "Unable to analyze your idea.");
      setShowResults(false);
      setAnalysis(null);
      setViabilityScore(0);

    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIdea("");
    setMessage("");
    setShowResults(false);
    setViabilityScore(0);
    setAnalysis(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#080b18] text-white">
      <Navbar />

      <main className="relative overflow-hidden px-6 py-14 md:py-20">

        <div className="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/10 blur-[120px]"></div>

        <div className="relative mx-auto max-w-5xl">

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300">
              ✦ AI Powered Startup Analysis
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Validate Your <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Startup Idea</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
              Describe your business idea and let Gemini AI evaluate its market potential, competition, strengths, weaknesses and overall viability.
            </p>
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-[#111426]/90 p-6 shadow-2xl shadow-purple-950/20 backdrop-blur-xl md:p-9">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-xl">
                💡
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Describe Your Startup
                </h2>
                <p className="text-sm text-gray-500">
                  Explain the problem and your proposed solution.
                </p>
              </div>
            </div>

            <textarea
              placeholder="Example: A food delivery app connecting home cooks with nearby customers..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={7}
              maxLength={5000}
              disabled={loading}
              className="mt-7 w-full resize-y rounded-2xl border border-white/10 bg-[#080b18] p-5 leading-7 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60"
            />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

              <p className="text-xs text-gray-500">
                {idea.length}/5000 characters
              </p>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-gray-300 transition hover:border-purple-400/50 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reset
                </button>

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3 font-semibold text-white shadow-lg shadow-purple-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Analyzing..." : "✦ Analyze Idea"}
                </button>

              </div>
            </div>

            {message && (
              <div className={`mt-6 rounded-xl border p-4 text-sm ${
                showResults
                  ? "border-green-500/20 bg-green-500/10 text-green-300"
                  : loading
                    ? "border-purple-500/20 bg-purple-500/10 text-purple-300"
                    : "border-amber-500/20 bg-amber-500/10 text-amber-300"
              }`}>
                {loading && (
                  <span className="mr-2 inline-block animate-spin">◌</span>
                )}
                {message}
              </div>
            )}

          </div>

          {showResults && analysis && (
            <section className="mt-14">

              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
                  Your Results
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  Startup Analysis
                </h2>

                <p className="mt-3 text-sm text-gray-400">
                  Here are the insights generated by Gemini AI for your idea.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div className="rounded-2xl border border-white/10 bg-[#111426] p-6 transition hover:border-purple-500/40">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📈</span>
                    <h3 className="text-lg font-semibold text-white">
                      Market Potential
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-gray-400">
                    {analysis?.market_potential}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#111426] p-6 transition hover:border-purple-500/40">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <h3 className="text-lg font-semibold text-white">
                      Competition Analysis
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-gray-400">
                    {analysis?.competition_analysis}
                  </p>
                </div>

                <div className="rounded-2xl border border-green-500/20 bg-[#111426] p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💪</span>
                    <h3 className="text-lg font-semibold text-green-400">
                      Strengths
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-gray-400">
                    {analysis?.strengths}
                  </p>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-[#111426] p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <h3 className="text-lg font-semibold text-red-400">
                      Weaknesses
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-gray-400">
                    {analysis?.weaknesses}
                  </p>
                </div>

              </div>

              <div className="mt-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#17152d] to-[#111426] p-7 md:p-9">

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
                      Overall Evaluation
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-white">
                      Startup Viability Score
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-4xl font-bold text-purple-400">
                      {viabilityScore}<span className="text-xl text-gray-500">/100</span>
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-400">
                      {viabilityScore >= 75
                        ? "High Potential"
                        : viabilityScore >= 50
                          ? "Moderate Potential"
                          : "Low Potential"}
                    </p>
                  </div>
                </div>

                <div className="mt-7 h-3 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-700"
                    style={{ width: `${viabilityScore}%` }}
                  ></div>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                  This score represents Gemini AI's evaluation of your startup idea based on the information provided. It is an AI-generated assessment, not a guarantee of business success.
                </p>

              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#111426] p-7 md:p-9">

                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  <h3 className="text-xl font-bold text-white">
                    Recommendations
                  </h3>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Suggested actions to improve your startup idea.
                </p>

                <ul className="mt-6 space-y-4">
                  {analysis?.recommendations?.map((recommendation, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#080b18] p-4 text-sm leading-6 text-gray-300"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-xs font-bold text-purple-400">
                        {index + 1}
                      </span>
                      {recommendation}
                    </li>
                  ))}
                </ul>

              </div>

            </section>
          )}

          <p className="mt-12 text-center text-xs leading-6 text-gray-600">
            Powered by Gemini AI · AI-generated insights should be validated through real market research.
          </p>

        </div>
      </main>
    </div>
  );
}

export default ValidateIdea;
