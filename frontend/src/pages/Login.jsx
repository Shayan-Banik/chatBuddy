import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BaseUrl } from "../config";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    axios
      .post(`${BaseUrl}/api/auth/login`, formData, { withCredentials: true })
      .then((response) => {
        console.log("Login successful:", response.data);
        toast.success("Logged in successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
        if (error.response?.data) {
          setErrors({ submit: error.response.data.message });
        } else {
          setErrors({ submit: "Login failed. Please try again." });
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#0d0d0d", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      {/* Ambient glows — same as homepage */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[120px] opacity-20"
          style={{ background: "#7c3aed" }} />
        <div className="absolute bottom-0 right-0 w-[350px] h-[250px] rounded-full blur-[100px] opacity-10"
          style={{ background: "#06b6d4" }} />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-base font-black"
              style={{ background: "linear-gradient(135deg,#7c3aed,#38bdf8)" }}
            >
              CB
            </div>
            <span className="text-2xl font-black tracking-tight"
              style={{ fontFamily: "'DM Serif Display',Georgia,serif", color: "#a78bfa" }}>
              ChatBuddy
            </span>
          </Link>
          <p className="text-white/40 text-sm mt-2">Welcome back — sign in to continue</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl border p-7"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.09)" }}
        >
          {/* Error */}
          {errors.submit && (
            <div className="mb-5 px-4 py-3 rounded-2xl border text-sm"
              style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)", color: "#fca5a5" }}>
              {errors.submit}
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-white/50 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-white placeholder-white/25 focus:outline-none border transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: errors.email ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(167,139,250,0.55)"}
                  onBlur={(e) => e.target.style.borderColor = errors.email ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-white/50 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl text-sm text-white placeholder-white/25 focus:outline-none border transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: errors.password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(167,139,250,0.55)"}
                  onBlur={(e) => e.target.style.borderColor = errors.password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded accent-violet-500"
                />
                <span className="text-xs text-white/40">Remember me</span>
              </label>
              <button type="button" className="text-xs font-medium transition-colors"
                style={{ color: "#a78bfa" }}
                onMouseEnter={(e) => e.target.style.color = "#c4b5fd"}
                onMouseLeave={(e) => e.target.style.color = "#a78bfa"}>
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              style={{
                background: isLoading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                boxShadow: isLoading ? "none" : "0 6px 22px rgba(124,58,237,0.4)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="text-xs text-white/25 flex-shrink-0">or continue with</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  label: "Google",
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  ),
                },
                {
                  label: "GitHub",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.743.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-12.009C24.007 5.367 18.641 0 12.017 0z"/>
                    </svg>
                  ),
                },
              ].map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-semibold text-white/60 border transition-all hover:text-white/90"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.09)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                >
                  {icon}{label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-white/35 text-xs mt-6">
          Don't have an account?{" "}
          <Link to="/register"
            className="font-semibold underline underline-offset-2 transition-colors"
            style={{ color: "#a78bfa" }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;