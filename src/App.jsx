import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login.jsx";
import { useSelector, useDispatch } from "react-redux";
import Todos from "./pages/Todos";
import Nav from "./components/Nav";
import Users from "./pages/Users";

export default function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // if (!isAuthenticated) {
  //   return <Login />;
  // }

  console.log("pppppp", user, isAuthenticated);
  return (
    <div className="min-h-screen">
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/todos" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
}
