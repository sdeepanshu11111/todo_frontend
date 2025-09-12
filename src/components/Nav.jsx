import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Nav() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    }
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow py-3">
      <div className="max-w-3xl mx-auto px-4 flex justify-between">
        <div className="font-bold">Todo App</div>
        <div className="space-x-4">
          <Link to="/todos" className="text-sm">
            Todos
          </Link>
          <Link to="/login" className="text-sm">
            Login
          </Link>
          <Link to="/register" className="text-sm">
            Register
          </Link>
          <button onClick={logout} className="text-sm text-red-500">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}