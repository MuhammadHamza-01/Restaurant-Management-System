import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, Pizza } from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(formData);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl grid md:grid-cols-2">

        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-between bg-[#8f2822] p-12 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-3">
                <Pizza size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Pizza Mahal</h1>
                <p className="text-sm text-white/70">Authentic Taste, Every Slice</p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-200">
              Welcome Back
            </p>
            <h2 className="text-4xl font-bold leading-tight">
              Good food brings people together.
            </h2>
            <p className="mt-5 max-w-sm leading-7 text-white/75">
              Sign in to continue enjoying your favorite meals and managing
              your restaurant experience.
            </p>
          </div>

          <p className="text-sm text-white/60">
            ┬⌐ {new Date().getFullYear()} Pizza Mahal. All rights reserved.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-7 sm:p-12">
          <div className="w-full max-w-md">

            <div className="mb-8">
              <div className="mb-5 inline-flex rounded-xl bg-[#fff1eb] p-3 text-[#a52a22] md:hidden">
                <Pizza size={28} />
              </div>

              <h2 className="text-3xl font-bold text-[#211c19]">
                Welcome back!
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Enter your credentials to access your account.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#a52a22] focus:bg-white focus:ring-4 focus:ring-[#a52a22]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-[#a52a22] focus:bg-white focus:ring-4 focus:ring-[#a52a22]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#a52a22]"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#a52a22] py-3.5 font-semibold text-white transition hover:bg-[#85211c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#a52a22] hover:underline"
              >
                Create Account
              </Link>
            </p>

            <p className="mt-10 text-center text-xs text-gray-400">
              Secure authentication powered by Pizza Mahal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
