import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BaseUrl } from "../config";

const inputBase = {
  background: "rgba(255,255,255,0.06)",
  borderColor: "rgba(255,255,255,0.1)",
};

const focusBorder = "rgba(167,139,250,0.55)";
const errorBorder = "rgba(239,68,68,0.5)";

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider text-white/45">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function StyledInput({ icon: Icon, error, innerRef, rightSlot, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      {Icon && (
        <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
      )}
      <input
        {...props}
        ref={innerRef}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e)  => { setFocused(false); props.onBlur?.(e); }}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} ${rightSlot ? "pr-11" : "pr-4"} py-3 rounded-2xl text-sm text-white placeholder-white/25 focus:outline-none border transition-all`}
        style={{
          ...inputBase,
          borderColor: error ? errorBorder : focused ? focusBorder : "rgba(255,255,255,0.1)",
        }}
      />
      {rightSlot && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {rightSlot}
        </div>
      )}
    </div>
  );
}

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors]       = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Password strength
  const getStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p)) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength();
  const strengthMeta = [
    { label: "Very Weak", color: "#ef4444" },
    { label: "Weak",      color: "#f97316" },
    { label: "Fair",      color: "#eab308" },
    { label: "Good",      color: "#3b82f6" },
    { label: "Strong",    color: "#22c55e" },
    { label: "Very Strong", color: "#16a34a" },
  ][strength] ?? { label: "", color: "" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post(
        `${BaseUrl}/api/auth/register`,
        {
          email: formData.email,
          fullName: { firstName: formData.firstName, lastName: formData.lastName },
          password: formData.password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response?.data) {
          const message = error.response.data.message;
          if (message.toLowerCase().includes("already")) {
            toast.info("You already have an account. Please log in.");
            setErrors({ submit: "User already exists" });
          } else {
            toast.error(message || "Registration failed. Please try again.");
            setErrors({ submit: message });
          }
        } else {
          toast.error("Registration failed. Please try again!");
          setErrors({ submit: "Registration failed. Please try again!" });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const passwordsMatch =
    formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#0d0d0d", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[120px] opacity-20"
          style={{ background: "#7c3aed" }} />
        <div className="absolute bottom-0 right-0 w-[350px] h-[250px] rounded-full blur-[100px] opacity-10"
          style={{ background: "#06b6d4" }} />
      </div>

      <div className="relative w-full max-w-sm py-8">

        {/* Logo */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex flex-col items-center gap-2.5">
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
          <p className="text-white/38 text-sm mt-1.5">Create your free account</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl border p-6"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.09)" }}
        >
          {/* Submit error */}
          {errors.submit && (
            <div className="mb-5 px-4 py-3 rounded-2xl border text-xs"
              style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)", color: "#fca5a5" }}>
              {errors.submit}
            </div>
          )}

          <div className="space-y-4">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name" error={errors.firstName}>
                <StyledInput
                  icon={User}
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  error={errors.firstName}
                />
              </Field>
              <Field label="Last Name" error={errors.lastName}>
                <StyledInput
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  error={errors.lastName}
                />
              </Field>
            </div>

            {/* Email */}
            <Field label="Email" error={errors.email}>
              <StyledInput
                icon={Mail}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                error={errors.email}
              />
            </Field>

            {/* Password */}
            <Field label="Password" error={errors.password}>
              <StyledInput
                icon={Lock}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                error={errors.password}
                rightSlot={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="text-white/30 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />
              {/* Strength bar */}
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i < strength ? strengthMeta.color : "rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium flex-shrink-0"
                    style={{ color: strengthMeta.color }}>
                    {strengthMeta.label}
                  </span>
                </div>
              )}
            </Field>

            {/* Confirm password */}
            <Field label="Confirm Password" error={errors.confirmPassword}>
              <StyledInput
                icon={Lock}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Repeat your password"
                error={errors.confirmPassword}
                rightSlot={
                  <>
                    {passwordsMatch && (
                      <Check size={13} className="text-emerald-400 flex-shrink-0" />
                    )}
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-white/30 hover:text-white/60 transition-colors">
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </>
                }
              />
            </Field>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-4 h-4 rounded-md border flex items-center justify-center transition-all"
                  style={{
                    background: agreedToTerms ? "#7c3aed" : "rgba(255,255,255,0.06)",
                    borderColor: agreedToTerms ? "#7c3aed" : "rgba(255,255,255,0.15)",
                  }}
                >
                  {agreedToTerms && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
              </div>
              <span className="text-xs text-white/45 leading-relaxed">
                I agree to the{" "}
                <button type="button" className="underline underline-offset-2 transition-colors"
                  style={{ color: "#a78bfa" }}>
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="underline underline-offset-2 transition-colors"
                  style={{ color: "#a78bfa" }}>
                  Privacy Policy
                </button>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-400 -mt-2">{errors.terms}</p>}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isLoading
                  ? "rgba(124,58,237,0.5)"
                  : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                boxShadow: isLoading ? "none" : "0 6px 22px rgba(124,58,237,0.4)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : "Create Account"}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3 py-0.5">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="text-[11px] text-white/25 flex-shrink-0">or continue with</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* Social */}
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
                  className="flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-semibold text-white/55 border transition-all hover:text-white/85"
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

        {/* Sign in link */}
        <p className="text-center text-white/32 text-xs mt-5">
          Already have an account?{" "}
          <Link to="/login"
            className="font-semibold underline underline-offset-2"
            style={{ color: "#a78bfa" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;