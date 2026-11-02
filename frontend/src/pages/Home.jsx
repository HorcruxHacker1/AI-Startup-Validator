
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-[#080b18] text-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-24 text-center md:py-32">

          <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/20 blur-[110px]"></div>

          <div className="relative mx-auto max-w-5xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2 text-sm font-medium text-purple-300">
              <span className="h-2 w-2 rounded-full bg-purple-400"></span>
              AI POWERED BUSINESS ANALYSIS
            </div>

            <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Turn Your Startup Idea
              <br />
              Into a{" "}
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Winning Vision
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
              Validate your business idea with artificial intelligence.
              Discover market opportunities, understand competition,
              evaluate strengths and weaknesses, and make smarter
              business decisions.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">

              <Link
                to="/validate"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-xl shadow-purple-900/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-500/30"
              >
                Validate My Idea →
              </Link>

              <a
                href="#features"
                className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-gray-300 transition hover:border-purple-500/50 hover:text-white"
              >
                Explore Features
              </a>

            </div>

            <p className="mt-6 text-sm text-gray-500">
              Powered by Gemini AI
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-20">

          <div className="mx-auto max-w-6xl">

            <div className="mb-14 text-center">
              <p className="font-semibold tracking-widest text-purple-400">
                OUR CAPABILITIES
              </p>

              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Everything You Need to Evaluate Your Idea
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-gray-400">
                Get meaningful insights to understand the potential
                of your business concept.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">

              <div className="group rounded-2xl border border-white/10 bg-gradient-to-b from-[#17172d] to-[#101323] p-7 transition duration-300 hover:-translate-y-2 hover:border-purple-500/40">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 text-2xl">
                  📊
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  Market Analysis
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Explore your target market, customer needs
                  and potential business opportunities.
                </p>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-gradient-to-b from-[#17172d] to-[#101323] p-7 transition duration-300 hover:-translate-y-2 hover:border-purple-500/40">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-2xl">
                  🎯
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  Competition Analysis
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Understand existing competitors, industry
                  challenges and your business position.
                </p>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-gradient-to-b from-[#17172d] to-[#101323] p-7 transition duration-300 hover:-translate-y-2 hover:border-purple-500/40">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-2xl">
                  🚀
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  Viability Score
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Receive an AI-generated score and practical
                  recommendations for your startup idea.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Call To Action */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/70 to-indigo-950/70 px-6 py-14 text-center md:px-12">

            <h2 className="text-3xl font-bold md:text-4xl">
              Have a Startup Idea?
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-300">
              Take the first step towards evaluating your business
              concept. Let AI help you explore its potential.
            </p>

            <Link
              to="/validate"
              className="mt-8 inline-block rounded-xl bg-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-950/50 transition hover:bg-purple-500"
            >
              Start Your Analysis →
            </Link>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center">
        <p className="font-semibold text-white">
          AI Startup <span className="text-purple-400">Validator</span>
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Powered by AI. Built for smarter startup decisions.
        </p>

        <p className="mt-4 text-xs text-gray-600">
          © 2026 AI Startup Validator. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default Home;
