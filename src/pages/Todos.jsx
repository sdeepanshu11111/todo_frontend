import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/todos");
      setTodos(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post("/todos", { title: text });
      setText("");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const toggle = async (todo) => {
    try {
      await api.put(`/todos/${todo._id}`, {
        completed: !todo.completed,
        title: todo.title,
      });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 bounce-in">
          <div className="flex items-center gap-3 text-white">
            <div className="animate-spin text-2xl">✨</div>
            <span className="text-lg font-medium">Loading your todos...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 floating">
            🎆 Your Fancy Todos
          </h1>
          <p className="text-white/80 text-sm sm:text-base lg:text-lg">
            {totalCount > 0 ? `${completedCount}/${totalCount} completed` : "Start adding some todos!"}
          </p>
          {totalCount > 0 && (
            <div className="mt-3 flex justify-center">
              <div className="bg-white/10 rounded-full px-4 py-1 text-xs sm:text-sm text-white/90">
                {Math.round((completedCount / totalCount) * 100)}% Complete
              </div>
            </div>
          )}
        </div>

        {/* Add Todo Form */}
        <div className="glass rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 fade-in pulse-glow">
          <form onSubmit={add} className="flex flex-col sm:flex-row gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done? ✨"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            />
            <button 
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base whitespace-nowrap"
            >
              ➕ <span className="hidden sm:inline">Add Todo</span><span className="sm:hidden">Add</span>
            </button>
          </form>
        </div>

        {/* Filter Tabs */}
        {todos.length > 0 && (
          <div className="glass rounded-2xl p-2 mb-4 sm:mb-6 fade-in">
            <div className="grid grid-cols-3 gap-1">
              {["all", "active", "completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-medium transition-all duration-200 capitalize text-xs sm:text-sm ${
                    filter === f
                      ? "bg-white text-purple-600 shadow-lg transform scale-105"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:scale-105"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                    <span className="text-base sm:text-lg">
                      {f === "all" && "📝"} {f === "active" && "⏳"} {f === "completed" && "✅"}
                    </span>
                    <span className="hidden sm:inline">{f}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Todos List */}
        <div className="space-y-2 sm:space-y-3">
          {filteredTodos.length === 0 && (
            <div className="glass rounded-2xl p-6 sm:p-8 text-center fade-in">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 floating">
                {filter === "completed" ? "🎉" : todos.length === 0 ? "📝" : "🔍"}
              </div>
              <p className="text-white/80 text-sm sm:text-base lg:text-lg">
                {filter === "completed" 
                  ? "No completed todos yet!" 
                  : todos.length === 0 
                  ? "No todos yet. Add one above!" 
                  : "No active todos!"}
              </p>
            </div>
          )}
          
          {filteredTodos.map((todo, index) => (
            <div
              key={todo._id}
              className="glass rounded-2xl p-3 sm:p-4 todo-item slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between gap-3">
                <div 
                  onClick={() => toggle(todo)}
                  className="flex items-center gap-3 cursor-pointer flex-1 group min-w-0"
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    todo.completed 
                      ? "bg-green-500 border-green-500 text-white" 
                      : "border-white/40 group-hover:border-white/60"
                  }`}>
                    {todo.completed && <span className="text-xs sm:text-sm">✓</span>}
                  </div>
                  <span className={`text-sm sm:text-base lg:text-lg transition-all duration-200 break-words ${
                    todo.completed 
                      ? "line-through text-white/50" 
                      : "text-white group-hover:text-white/90"
                  }`}>
                    {todo.title}
                  </span>
                </div>
                
                <button
                  onClick={() => remove(todo._id)}
                  className="bg-red-500/20 hover:bg-red-500/40 text-red-200 hover:text-white p-2 rounded-xl transition-all duration-200 transform hover:scale-110 active:scale-95 flex-shrink-0"
                >
                  <span className="text-sm sm:text-base">🗑️</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="glass rounded-2xl p-3 sm:p-4 mt-4 sm:mt-6 fade-in">
            <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-between sm:items-center text-white/80 text-xs sm:text-sm">
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl">📊</div>
                <div>{todos.length} total</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl">✅</div>
                <div>{completedCount} done</div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-lg sm:text-xl">⏳</div>
                <div>{totalCount - completedCount} left</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Actions - Mobile Only */}
        {todos.length > 0 && (
          <div className="fixed bottom-4 right-4 sm:hidden">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="glass w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-200"
              >
                ⬆️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}