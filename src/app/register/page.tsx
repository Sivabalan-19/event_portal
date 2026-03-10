"use client";
import { Input } from "@/components/index";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createData } from "@/utils/axios";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineIdcard,
  AiOutlineBank,
} from "react-icons/ai";

type Role = "student" | "organizer";

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Mathematics",
  "Physics",
];

const YEARS = ["1", "2", "3", "4"];

function Page() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rollNo: "",
    department: "",
    year: "",
  });

  const patch = (key: keyof typeof form, value: string) => {
    setError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const payload: Record<string, string> = {
      name: form.name,
      email: form.email,
      password: form.password,
      role,
      department: form.department,
    };

    if (role === "student") {
      payload.rollNo = form.rollNo;
      payload.year = form.year;
    }

    setIsLoading(true);
    try {
      await createData("/auth/register", payload);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
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
              Join Your Campus Community.
            </h2>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Create your account to discover events, connect with peers, and
              stay on top of everything happening at your college.
            </p>
            <div className="space-y-4">
              {[
                { icon: "event", text: "Register for campus events instantly" },
                {
                  icon: "badge",
                  text: "Faculty can create and manage events",
                },
                {
                  icon: "notifications",
                  text: "Get notified about upcoming activities",
                },
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
        <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12 md:p-16 bg-gray-50">
          <div className="w-full max-w-110">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
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

            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-1">
                Create an account
              </h2>
              <p className="text-slate-500 text-sm">
                Fill in your details to get started
              </p>
            </div>

            {/* Role Toggle */}
            <div className="flex gap-1 p-1 rounded-xl bg-slate-200 mb-6">
              {(["student", "organizer"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${
                    role === r
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {r === "organizer" ? "Faculty" : "Student"}
                </button>
              ))}
            </div>

            {success ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-5 text-center text-sm text-green-700">
                <span className="material-symbols-outlined block text-3xl mb-2 text-green-500">
                  check_circle
                </span>
                <p className="font-semibold text-base mb-1">
                  Registration successful!
                </p>
                <p>Redirecting you to the login page…</p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Full Name */}
                <Input
                  id="name"
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  icon={<AiOutlineUser />}
                  value={form.name}
                  onChange={(e) => patch("name", e.target.value)}
                />

                {/* Email */}
                <Input
                  id="email"
                  label="College Email"
                  type="email"
                  placeholder="name@college.edu"
                  icon={<AiOutlineMail />}
                  value={form.email}
                  onChange={(e) => patch("email", e.target.value)}
                />

                {/* Student-only fields */}
                {role === "student" && (
                  <Input
                    id="rollNo"
                    label="Roll Number"
                    type="text"
                    placeholder="CSE2023001"
                    icon={<AiOutlineIdcard />}
                    value={form.rollNo}
                    onChange={(e) => patch("rollNo", e.target.value)}
                  />
                )}

                {/* Department */}
                <div className="space-y-2">
                  <label
                    htmlFor="department"
                    className="text-sm font-semibold block"
                  >
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none text-slate-400">
                      <AiOutlineBank />
                    </div>
                    <select
                      id="department"
                      value={form.department}
                      onChange={(e) => patch("department", e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-200 bg-white outline-none transition-all text-slate-900 appearance-none"
                      required
                    >
                      <option value="" disabled>
                        Select department
                      </option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined text-base">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Year (student only) */}
                {role === "student" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="year"
                      className="text-sm font-semibold block"
                    >
                      Year of Study
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined text-base">
                          school
                        </span>
                      </div>
                      <select
                        id="year"
                        value={form.year}
                        onChange={(e) => patch("year", e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-200 bg-white outline-none transition-all text-slate-900 appearance-none"
                        required
                      >
                        <option value="" disabled>
                          Select year
                        </option>
                        {YEARS.map((y) => (
                          <option key={y} value={y}>
                            Year {y}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined text-base">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Password */}
                <Input
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  icon={<AiOutlineLock />}
                  value={form.password}
                  onChange={(e) => patch("password", e.target.value)}
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

                {/* Confirm Password */}
                <Input
                  id="confirmPassword"
                  label="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  icon={<AiOutlineLock />}
                  value={form.confirmPassword}
                  onChange={(e) => patch("confirmPassword", e.target.value)}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? (
                        <AiOutlineEyeInvisible className="text-xl" />
                      ) : (
                        <AiOutlineEye className="text-xl" />
                      )}
                    </button>
                  }
                />

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70 text-white w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
                >
                  {isLoading ? "Creating account…" : "Create account"}
                  {!isLoading && (
                    <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  )}
                </button>

                <p className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Sign in
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
