import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      setMsg("✅ Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-6 sm:p-8 fade-in pulse-glow">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 floating">🚀</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Join FancyTodo
            </h2>
            <p className="text-white/80 text-sm sm:text-base">
              Create your account and start organizing!
            </p>
          </div>

          <form onSubmit={submit} className="space-y-3 sm:space-y-4">
            <div>
              <input
                name="username"
                placeholder="👤 Username"
                value={form.username}
                onChange={handle}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                placeholder="📧 Email Address"
                value={form.email}
                onChange={handle}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="🔒 Password"
                value={form.password}
                onChange={handle}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
            >
              {loading ? (
                <div className="animate-spin text-xl sm:text-2xl">⭐</div>
              ) : (
                <>🎉 <span className="ml-2">Create Account</span></>
              )}
            </button>
          </form>

          {msg && (
            <div
              className={`mt-4 p-3 rounded-xl text-center font-medium ${
                msg.includes("✅")
                  ? "bg-green-500/20 text-green-200 border border-green-500/30"
                  : "bg-red-500/20 text-red-200 border border-red-500/30"
              }`}
            >
              {msg}
            </div>
          )}

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-white/80 text-sm sm:text-base">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white font-medium hover:text-white/90 transition-colors duration-200 hover:underline"
              >
                Sign in here! 👈
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
