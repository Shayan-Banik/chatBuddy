import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { BaseUrl } from "../config";
import axios from "axios";

const stats = [
  { value: "10M+", label: "Conversations" },
  { value: "500K+", label: "Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "150+", label: "Integrations" },
];

export default function Home() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/auth/checkAuth`, {
          withCredentials: true,
        });
        if (!mounted) return;
        setAuthenticated(Boolean(res.data && res.data.authenticated));
      } catch (err) {
        console.error("Auth check error:", err);
        setAuthenticated(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const bg = dark ? "bg-[#0d0d0d] text-white" : "bg-[#f5f3ef] text-[#1a1a1a]";

  const navBg = dark
    ? "bg-[#0d0d0d]/80 border-white/10"
    : "bg-[#f5f3ef]/80 border-black/10";

  const accent = dark ? "text-[#a78bfa]" : "text-[#7c3aed]";
  const accentBg = dark
    ? "bg-[#a78bff] text-white hover:bg-[#c4b5fd]"
    : "bg-[#7c3aed] text-white hover:bg-[#6d28d9]";

  const secondaryBtn = dark
    ? "border border-white/25 text-white hover:bg-white/8"
    : "border border-black/25 text-black hover:bg-black/6";

  const statCard = dark
    ? "bg-white/5 border border-white/10"
    : "bg-white border border-black/8 shadow-sm";

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${bg}`}
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px] opacity-25 transition-colors duration-300 ${
            dark ? "bg-[#7c3aed]" : "bg-[#c4b5fd]"
          }`}
        />
        <div
          className={`absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full blur-[100px] opacity-15 transition-colors duration-300 ${
            dark ? "bg-[#06b6d4]" : "bg-[#bae6fd]"
          }`}
        />
      </div>

      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 border-b backdrop-blur-xl ${navBg}`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold ${
              dark ? "bg-[#7c3aed]" : "bg-[#7c3aed]"
            }`}>
            CB
          </div>
          <span className={`font-bold text-lg tracking-tight ${accent}`}>
            ChatBuddy
          </span>
        </div>

        {/* Right actions */}
        {loading ? (
          <div className="w-24 h-8 bg-gray-300 rounded-lg animate-pulse" />
        ) : authenticated ? (
          <a
            href="/chatpage"
            className={`px-4 py-2 rounded-lg font-medium animate-pulse transition-all ${accentBg}`}>
            Go to Chat
          </a>
        ) : (
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
                dark
                  ? "bg-white/8 border-white/15 hover:bg-white/15"
                  : "bg-black/6 border-black/12 hover:bg-black/10"
              }`}
              aria-label="Toggle theme">
              {dark ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-4.5 h-4.5 w-[18px] h-[18px]">
                  <circle cx="12" cy="12" r="5" />
                  <path
                    d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-[18px] h-[18px]">
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <a
              href="/register"
              className={`hidden md:inline-flex px-4 py-2 rounded-xl text-sm font-medium transition-all ${secondaryBtn}`}>
              Register
            </a>
            <a
              href="/login"
              className={`hidden md:inline-flex px-4 py-2 rounded-xl text-sm font-semibold transition-all ${accentBg}`}>
              Log in
            </a>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                dark
                  ? "border-white/15 hover:bg-white/8"
                  : "border-black/12 hover:bg-black/6"
              }`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4">
                {menuOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        )}
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className={`fixed top-[69px] left-0 right-0 z-40 border-b px-6 py-4 flex flex-col gap-3 text-sm backdrop-blur-xl ${navBg}`}>
          {["New Chat", "Library", "Search Chats", "Projects"].map((item) => (
            <a key={item} href="#" className="py-1.5 opacity-80 font-medium">
              {item}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <a
              href="/register"
              className={`flex-1 text-center py-2 rounded-xl font-medium border transition-all ${secondaryBtn}`}>
              Register
            </a>
            <a
              href="/login"
              className={`flex-1 text-center py-2 rounded-xl font-semibold transition-all ${accentBg}`}>
              Log in
            </a>
          </div>
        </div>
      )}

      {/* HERO */}
      <main className="relative pt-36 pb-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <div
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}>
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-8 tracking-wider uppercase"
            style={{
              borderColor: dark
                ? "rgba(167,139,250,0.3)"
                : "rgba(124,58,237,0.25)",
              background: dark
                ? "rgba(167,139,250,0.1)"
                : "rgba(167,139,250,0.08)",
              color: dark ? "#a78bfa" : "#7c3aed",
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Now with GPT-4o & Claude
          </div>

          {/* Heading */}
          <h1
            className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            What can I{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: dark
                  ? "linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)"
                  : "linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)",
              }}>
              help
            </span>{" "}
            with?
          </h1>

          <p
            className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 ${dark ? "text-white/55" : "text-black/50"}`}>
            ChatBuddy is your all-in-one AI companion — build prototypes,
            research deeply, and bring ideas to life in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <a
              href="/register"
              className={`px-7 py-3 rounded-2xl text-base font-bold transition-all shadow-lg ${accentBg}`}
              style={{
                boxShadow: dark
                  ? "0 8px 30px rgba(124,58,237,0.35)"
                  : "0 8px 30px rgba(124,58,237,0.25)",
              }}>
              Sign up for free
            </a>
            <a
              href="/login"
              className={`px-7 py-3 rounded-2xl text-base font-semibold transition-all ${secondaryBtn}`}>
              Log in →
            </a>
          </div>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}>
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl p-5 text-center ${statCard}`}>
              <p className={`text-3xl font-black tracking-tight ${accent}`}>
                {s.value}
              </p>
              <p
                className={`text-xs mt-1 font-medium ${dark ? "text-white/45" : "text-black/45"}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Render nested routes (e.g. ChatPage) */}
        <Outlet />
      </main>
    </div>
  );
}
