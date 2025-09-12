import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login.jsx";
import Todos from "./pages/Todos";
import Nav from "./components/Nav";

export default function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/todos" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={<Todos />} />
      </Routes>
    </div>
  );
}