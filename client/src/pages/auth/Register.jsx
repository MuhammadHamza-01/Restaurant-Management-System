import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, User, Pizza } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({name: "", email: "", password: ""});
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

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {

      await register({name: formData.name, email: formData.email, password: formData.password});
      navigate("/", { replace: true });

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl grid md:grid-cols-2">

        {/* Branding Section */}
        <div className="hidden md:flex flex-col justify-between bg-[#8f2822] p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <Pizza size={30} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Pizza Mahal</h1>
              <p className="text-sm text-white/70">
                Authentic Taste, Every Slice
              </p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-200">
              Join Our Family
            </p>

            <h2 className="text-4xl font-bold leading-tight">
              Great moments start with great food.
            </h2>

            <p className="mt-5 max-w-sm leading-7 text-white/75">
              Create your account and enjoy a better restaurant experience
              with Pizza Mahal.
            </p>
          </div>

          <p className="text-sm text-white/60">
            ┬⌐ {new Date().getFullYear()} Pizza Mahal. All rights reserved.
          </p>
        </div>

        {/* Registration Form */}
        <div className="flex items-center justify-center p-7 sm:p-12">
          <div className="w-full max-w-md">

            <div className="mb-7">
              <div className="mb-5 inline-flex rounded-xl bg-[#fff1eb] p-3 text-[#a52a22] md:hidden">
                <Pizza size={28} />
              </div>

              <h2 className="text-3xl font-bold text-[#211c19]">
                Create Account
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Enter your details to get started.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    minLength={3}
                    maxLength={50}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#a52a22] focus:bg-white focus:ring-4 focus:ring-[#a52a22]/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
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
                <label className="mb-1 block text-sm font-semibold text-gray-700">
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
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    minLength={8}
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

             

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#a52a22] py-3.5 font-semibold text-white transition hover:bg-[#85211c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#a52a22] hover:underline"
              >
                Sign In
              </Link>
            </p>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
