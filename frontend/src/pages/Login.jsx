import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [companyId, setCompanyId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Prefill mode based on query param (e.g. /login?role=admin)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qRole = params.get("role");
    if (qRole === "admin" || qRole === "company" || qRole === "user") {
      setRole(qRole);
    }
  }, [location.search]);

  const decodeToken = (token) => {
    try {
      const [, payload] = token.split(".");
      const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token) {
        throw new Error("No token returned from server");
      }

      localStorage.setItem("token", data.token);
      const decoded = decodeToken(data.token);
      const userRole = decoded?.role;
      if (userRole === "admin" || userRole === "company") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e?.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please enter name, email, and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          companyId: companyId || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Backend returns token on register; use it to auto-login
      if (data.token) {
        localStorage.setItem("token", data.token);
        const decoded = decodeToken(data.token);
        const userRole = decoded?.role;
        if (userRole === "admin" || userRole === "company") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
        return;
      }

      // Fallback: if no token, switch to login mode
      setMode("login");
      setError("Account created. Please sign in.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg min-h-screen">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="inline-flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent to-blue-500" />
            <div>
              <div className="text-2xl font-bold tracking-tight">OpsMind AI</div>
              <div className="text-sm text-slate-300">
                Production-style knowledge brain for SOPs
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-panel/60 p-5 shadow-glow backdrop-blur">
            <div className="text-sm text-slate-200">
              {mode === "login" ? (
                <>Sign in to access your company workspace.</>
              ) : (
                <>Create an account and choose your role for this environment.</>
              )}
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>• Admin/Company can upload documents.</li>
              <li>• Users can ask questions only.</li>
              <li>• Retrieval is scoped to companyId.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-panel2/70 p-6 shadow-glow backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">
                {mode === "login" ? "Sign in" : "Create account"}
              </div>
              <div className="mt-1 text-sm text-slate-400">
                {mode === "login"
                  ? "Use your email + password."
                  : "You can set companyId now or let OpsMind auto-assign."}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setError("");
                setMode(mode === "login" ? "signup" : "login");
              }}
              className="rounded-xl border border-line px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>

          <form
            className="mt-6 space-y-3"
            onSubmit={mode === "login" ? handleLogin : handleSignup}
          >
            {mode === "signup" && (
              <>
                <div>
                  <label className="text-xs font-medium text-slate-300">Full name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-accent/60"
                    placeholder="Admin User"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-slate-300">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-accent/60"
                    >
                      <option value="admin">Admin</option>
                      <option value="company">Company</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300">
                      Company ID (optional)
                    </label>
                    <input
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-accent/60"
                      placeholder="auto-assign"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-medium text-slate-300">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-accent/60"
                placeholder="you@company.com"
                type="email"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-accent/60"
                placeholder="••••••••"
                type="password"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-blue-500 px-4 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {mode === "login" ? "Signing in…" : "Creating…"}
                </>
              ) : mode === "login" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="mt-4 text-xs text-slate-400">
            Tip: create an <span className="text-slate-200">Admin</span> or{" "}
            <span className="text-slate-200">Company</span> account to upload PDFs.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

