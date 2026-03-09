"use client";
import { Input } from "@/components/index";
import { useState } from "react";
import {
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";

function Page() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isRemeber: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Signing in as ${formData.email}`);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <div
        className="flex min-h-screen"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* ── Left Panel ── */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 bg-blue-600">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-600 to-blue-800 opacity-90" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 max-w-md text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <span className="material-symbols-outlined text-white text-4xl">
                  school
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                CampusConnect
              </h1>
            </div>
            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              Your Gateway to Campus Life.
            </h2>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Join thousands of students and faculty members. Discover events,
              join clubs, and stay connected with your college community.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: "calendar_month",
                  text: "Never miss another campus event",
                },
                { icon: "groups", text: "Connect with interest-based clubs" },
              ].map(({ icon, text }) => (
                <div
                  key={icon}
                  className="flex items-center gap-4 p-4 rounded-lg backdrop-blur-sm border border-white/10"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <span className="material-symbols-outlined text-blue-200">
                    {icon}
                  </span>
                  <p className="text-sm font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-gray-50">
          <div className="w-full max-w-110">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ color: "var(--color-primary)" }}
              >
                school
              </span>
              <span className="text-2xl font-bold text-slate-900">
                CampusConnect
              </span>
            </div>
            <div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email */}
                <Input
                  id="email"
                  label="College Email"
                  type="email"
                  placeholder="name@college.edu"
                  icon={<AiOutlineMail />}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                {/* Password */}
                <div className="space-y-2">
                  <Input
                    label="Password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    icon={<AiOutlineLock />}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible className="text-xl" />
                        ) : (
                          <AiOutlineEye className="text-xl" />
                        )}
                      </button>
                    }
                  />
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={formData.isRemeber}
                    onChange={(e) =>
                      setFormData({ ...formData, isRemeber: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-blue-600"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-600 select-none cursor-pointer"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
                >
                  Sign in
                  <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-4 text-sm text-slate-500 bg-gray-50">
                  Or continue with SSO
                </span>
              </div>

              {/* SSO */}
              <button className="flex items-center justify-center gap-3 w-full py-3.5 px-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo64nueiuXqrEUNYEJeaHxQf38FoRuIGmKREM5bLrWRecO_X3bEwDkFn76SQj7r5Of-hJJ-zvoVeu7EFlJdqUdVCMGF3N6guvdXZOjtL3BrBnV5pB_kghAZIEC6cNMpWodR4IQ0QPJr6aaYUqaTPQllsUTY7uK9QtnxBmfljeI4sjMNX_IVwndSPZoWPxILGRtFsKq8EL-gjoYgWnWhfzdAseZrtixjVfjTj8TRlLkbWyyvO-tfOLa4QLlBqd6OAd7n9vL20H-Yzo"
                  alt="Google Logo"
                  className="w-4 h-4"
                />
                Sign in with College Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
