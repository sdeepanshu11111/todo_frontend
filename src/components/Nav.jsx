import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    }
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <nav className="glass backdrop-blur-md border-b border-white/20 py-3 sm:py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 floating">
            <span className="text-2xl sm:text-3xl">✨</span>
            <span className="gradient-text bg-white bg-clip-text text-transparent hidden sm:inline">
              FancyTodo
            </span>
            <span className="gradient-text bg-white bg-clip-text text-transparent sm:hidden">
              Todo
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link 
              to="/todos" 
              className="text-white/90 hover:text-white transition-all duration-200 font-medium hover:scale-105 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              📝 <span className="hidden lg:inline">Todos</span>
            </Link>
            <Link 
              to="/login" 
              className="text-white/90 hover:text-white transition-all duration-200 font-medium hover:scale-105 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              🔐 <span className="hidden lg:inline">Login</span>
            </Link>
            <Link 
              to="/register" 
              className="text-white/90 hover:text-white transition-all duration-200 font-medium hover:scale-105 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              👤 <span className="hidden lg:inline">Register</span>
            </Link>
            <button 
              onClick={logout} 
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white px-3 lg:px-4 py-2 rounded-full transition-all duration-200 font-medium hover:scale-105"
            >
              🚪 <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 pb-2 space-y-2">
            <Link 
              to="/todos" 
              onClick={() => setIsOpen(false)}
              className="block text-white/90 hover:text-white transition-all duration-200 font-medium px-4 py-3 rounded-lg hover:bg-white/10"
            >
              📝 Todos
            </Link>
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className="block text-white/90 hover:text-white transition-all duration-200 font-medium px-4 py-3 rounded-lg hover:bg-white/10"
            >
              🔐 Login
            </Link>
            <Link 
              to="/register" 
              onClick={() => setIsOpen(false)}
              className="block text-white/90 hover:text-white transition-all duration-200 font-medium px-4 py-3 rounded-lg hover:bg-white/10"
            >
              👤 Register
            </Link>
            <button 
              onClick={logout} 
              className="w-full text-left bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}