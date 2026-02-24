import { Building2, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthSelect() {
  const navigate = useNavigate();

  return (
    <div className="app-gradient min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4">
        <h1 className="mb-2 text-2xl font-semibold text-slate-50">
          Choose how you want to continue
        </h1>
        <p className="mb-8 text-sm text-slate-300">
          OpsMind supports both document owners and consumers. Pick the access that matches
          your role.
        </p>

        <div className="grid w-full gap-6 md:grid-cols-2">
          {/* Admin / Company column */}
          <div className="group rounded-2xl bg-white/5 p-5 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-2xl">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-200 ring-1 ring-purple-400/40">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-50">Login as Admin / Company</h2>
            <p className="mt-2 text-sm text-slate-300">
              Upload SOPs, manage document ingestion, and configure access for your
              organization.
            </p>
            <button
              onClick={() => navigate("/login?role=admin")}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Continue as Admin
            </button>
          </div>

          {/* User column */}
          <div className="group rounded-2xl bg-white/5 p-5 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-2xl">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-200 ring-1 ring-sky-400/40">
              <UserRound className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-50">Login as User</h2>
            <p className="mt-2 text-sm text-slate-300">
              Ask questions and explore your company&apos;s operational knowledge — read
              only, no uploads.
            </p>
            <button
              onClick={() => navigate("/login?role=user")}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Continue as User
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 text-xs text-slate-300 underline-offset-2 hover:underline"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

