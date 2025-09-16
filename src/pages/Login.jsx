import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { loginUser, clearError } from "../store/authSlice";
import DOMPurify from "dompurify";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handle = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setForm({ ...form, [name]: sanitizedValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    dispatch(clearError());
    const result = await dispatch(loginUser(form));
    if (result.type === 'auth/login/fulfilled') {
      navigate("/todos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-6 sm:p-8 fade-in pulse-glow">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 floating">
              🔐
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome Back!
            </h2>
            <p className="text-white/80 text-sm sm:text-base">
              Sign in to your fancy todo account
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4 sm:space-y-6">
            <div>
              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="📧 Email Address"
                onChange={handle}
                className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                  errors.email ? "border-red-500/50" : ""
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-200">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  placeholder="🔒 Password"
                  onChange={handle}
                  className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                    errors.password ? "border-red-500/50" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors duration-200"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-200">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="animate-spin text-xl sm:text-2xl">✨</div>
              ) : (
                <>
                  🚀 <span className="ml-2">Sign In</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-3 rounded-xl text-center font-medium bg-red-500/20 text-red-200 border border-red-500/30">
                {error}
              </div>
            )}
          </form>

          <GoogleLoginButton />

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-white/80 text-sm sm:text-base">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-white font-medium hover:text-white/90 transition-colors duration-200 hover:underline"
              >
                Sign up here! 👉
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}