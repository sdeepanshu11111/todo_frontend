import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen p-6 flex items-start justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">My Todos</h2>

        <form onSubmit={add} className="flex gap-2 mb-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add todo..."
            className="flex-1 p-2 border rounded"
          />
          <button className="bg-blue-600 text-white px-4 rounded">Add</button>
        </form>

        <ul className="space-y-2">
          {todos.length === 0 && (
            <li className="text-sm text-gray-500">No todos yet</li>
          )}
          {todos.map((t) => (
            <li
              key={t._id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <span
                onClick={() => toggle(t)}
                className={`cursor-pointer ${
                  t.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {t.title}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => remove(t._id)} className="text-red-500">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}