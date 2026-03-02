import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { isAdminLoggedIn } from "../../utils/auth";
import { toast } from "react-toastify";
import logo from "../../src/assets/logo_new.png"; // ✅ correct path (remove /src)

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/admin/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      toast.success("Login successful");

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* 🔥 Logo + Title Horizontal */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <img
            src={logo}
            alt="EduFin Logo"
            className="w-16 h-16 object-contain"
          />

          <div className="h-10 w-px bg-gray-300"></div>

          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
        </div>

        <p className="text-gray-500 text-center mb-6 text-sm">
          Sign in to access admin dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              placeholder="admin@edufin.com"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg transition text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          © {new Date().getFullYear()} EduFin Scholarships – Admin Panel
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
