import { ArrowRight, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="app-gradient min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        {/* Nav */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/40">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.2em] text-slate-200">
                OPSMIND AI
              </div>
              <div className="text-xs text-slate-400">Operational Knowledge Brain</div>
            </div>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-100 shadow-md shadow-black/40 backdrop-blur hover:bg-white/10 hover:shadow-lg hover:shadow-black/50 transition-all duration-300"
          >
            Sign in
          </button>
        </header>

        {/* Hero */}
        <main className="flex flex-1 flex-col items-start justify-center gap-10 py-10 md:flex-row md:items-center">
          <section className="max-w-xl space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-white/10 backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Secure, multi-tenant RAG for enterprises</span>
            </p>

            <h1 className="text-4xl font-semibold leading-tight text-slate-50 md:text-5xl">
              Your Company&apos;s{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
                Knowledge Brain
              </span>
            </h1>

            <p className="max-w-lg text-sm text-slate-300 md:text-base">
              OpsMind transforms your SOPs and internal docs into a context-aware AI that
              can answer questions, surface procedures, and keep teams aligned — without
              ever leaving your secure environment.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate("/auth-select")}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Users className="h-4 w-4 text-slate-200" />
                <span>Built for modern operations teams</span>
              </div>
            </div>
          </section>

          {/* Right side graphic */}
          <section className="mt-10 w-full max-w-md md:mt-0">
            <div className="relative overflow-hidden rounded-3xl bg-white/5 p-5 shadow-xl shadow-black/40 ring-1 ring-white/10 backdrop-blur">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-indigo-500/15 to-sky-500/15" />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-medium">OpsMind Console</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] text-emerald-300 ring-1 ring-emerald-500/40">
                    Live
                  </span>
                </div>

                <div className="space-y-2 rounded-2xl bg-neutral-950/60 p-3 ring-1 ring-white/10">
                  <div className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
                    Recent activity
                  </div>
                  <ul className="space-y-1 text-xs text-slate-200">
                    <li>• SOP.pdf ingested for ACME Corp</li>
                    <li>• Vector index updated (384d)</li>
                    <li>• 3 new chats started</li>
                  </ul>
                </div>

                <div className="rounded-2xl bg-white/8 p-3 ring-1 ring-white/10">
                  <div className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-slate-400">
                    RAG pipeline
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[0.7rem] text-slate-200">
                    <div className="rounded-xl bg-neutral-950/60 p-2">
                      <div className="font-semibold">Ingest</div>
                      <div className="mt-1 text-slate-400">PDF → Chunks → Embeds</div>
                    </div>
                    <div className="rounded-xl bg-neutral-950/60 p-2">
                      <div className="font-semibold">Retrieve</div>
                      <div className="mt-1 text-slate-400">Atlas vector search</div>
                    </div>
                    <div className="rounded-xl bg-neutral-950/60 p-2">
                      <div className="font-semibold">Answer</div>
                      <div className="mt-1 text-slate-400">Strictly grounded</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Features */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5 text-emerald-300" />}
            title="Secure Multi-Tenant Architecture"
            description="Isolate company data with strict companyId scoping across ingestion, retrieval, and chat history."
          />
          <FeatureCard
            icon={<Sparkles className="h-5 w-5 text-sky-300" />}
            title="Intelligent RAG System"
            description="Atlas vector search + local embeddings ensure fast, relevant, and grounded answers."
          />
          <FeatureCard
            icon={<Users className="h-5 w-5 text-purple-200" />}
            title="Role-Based Access Control"
            description="Admins and companies manage documents; users safely query read-only knowledge."
          />
        </section>

        <footer className="mt-10 border-t border-white/10 pt-4 text-xs text-slate-400">
          OpsMind AI © 2026. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group rounded-2xl bg-white/5 p-4 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl hover:shadow-black/60">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
        {icon}
      </div>
      <div className="text-sm font-semibold text-slate-100">{title}</div>
      <div className="mt-2 text-xs text-slate-300">{description}</div>
    </div>
  );
}

