import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/auth/register", form);
      setMsg("Registered — redirecting to login...");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <input
          name="username"
          placeholder="username"
          onChange={handle}
          className="w-full p-2 border mb-3 rounded"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handle}
          className="w-full p-2 border mb-3 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handle}
          className="w-full p-2 border mb-3 rounded"
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>
        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </form>
    </div>
  );
}
