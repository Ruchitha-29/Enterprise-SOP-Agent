import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000";

function decodeToken(token) {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function Spinner() {
  return (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-slate-200" />
  );
}

export default function MainLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = useMemo(() => (token ? decodeToken(token) : null), [token]);

  const canUpload = user?.role === "admin" || user?.role === "company";

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const listRef = useRef(null);

  const authHeaders = useMemo(() => {
    const t = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${t}`,
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchSessions = async () => {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      headers: authHeaders,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load sessions");
    setSessions(data.sessions || []);
  };

  const loadSession = async (id) => {
    setActiveSessionId(id);
    const res = await fetch(`${BACKEND_URL}/api/chat/${id}`, {
      headers: authHeaders,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load session");
    setMessages(data.session?.messages || []);
  };

  const newChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setQuestion("");
  };

  const sendQuestion = async () => {
    const q = question.trim();
    if (!q) return;

    setQuestion("");
    setLoading(true);

    // Optimistic user message
    setMessages((prev) => [...prev, { role: "user", content: q }]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          question: q,
          sessionId: activeSessionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Query failed");

      const assistant = data.answer || "No answer returned.";
      setMessages((prev) => [...prev, { role: "assistant", content: assistant }]);

      if (data.sessionId && data.sessionId !== activeSessionId) {
        setActiveSessionId(data.sessionId);
      }

      // Refresh sidebar list after each turn
      await fetchSessions();
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry — something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchSessions().catch(() => {
      // token might be invalid/expired
      logout();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  const onUpload = async (file) => {
    if (!file) return;
    setUploadStatus("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        headers: authHeaders,
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setUploadStatus(data.message || "Upload successful");
    } catch (e) {
      setUploadStatus(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="app-bg h-full">
      <div className="mx-auto flex h-full max-w-[1400px] gap-4 p-3 md:p-4">
        {/* Sidebar */}
        <aside
          className={[
            "flex h-full w-[320px] shrink-0 flex-col rounded-2xl border border-line bg-panel/80 shadow-glow backdrop-blur",
            sidebarOpen ? "" : "hidden md:flex",
          ].join(" ")}
        >
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent to-blue-500" />
              <div>
                <div className="text-sm font-semibold tracking-wide">OpsMind AI</div>
                <div className="text-xs text-slate-400">
                  {user?.role ? `${user.role.toUpperCase()} · ${user.companyId || "no-company"}` : ""}
                </div>
              </div>
            </div>
            <button
              className="rounded-lg px-2 py-1 text-xs text-slate-300 hover:bg-white/5"
              onClick={() => setSidebarOpen(false)}
            >
              Hide
            </button>
          </div>

          <div className="p-3">
            <button
              onClick={newChat}
              className="w-full rounded-xl bg-gradient-to-r from-accent to-blue-500 px-3 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
              disabled={loading}
            >
              + New chat
            </button>
          </div>

          <div className="flex-1 overflow-auto px-2 pb-2">
            <div className="px-2 pb-2 text-xs font-medium text-slate-400">
              Conversations
            </div>
            <div className="space-y-1">
              {sessions.map((s) => (
                <button
                  key={s._id}
                  onClick={() => loadSession(s._id)}
                  className={[
                    "w-full rounded-xl px-3 py-2 text-left text-sm",
                    "hover:bg-white/5",
                    activeSessionId === s._id ? "bg-white/5 ring-1 ring-white/10" : "",
                  ].join(" ")}
                >
                  <div className="truncate font-medium text-slate-100">
                    {s.title || "Untitled"}
                  </div>
                  <div className="truncate text-xs text-slate-400">
                    {new Date(s.updatedAt).toLocaleString()}
                  </div>
                </button>
              ))}
              {sessions.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-slate-400">
                  No conversations yet.
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-line p-3">
            <button
              onClick={logout}
              className="w-full rounded-xl border border-line bg-white/0 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <section className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-panel2/70 shadow-glow backdrop-blur">
          <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                className="rounded-lg px-2 py-1 text-xs text-slate-300 hover:bg-white/5 md:hidden"
                onClick={() => setSidebarOpen((s) => !s)}
              >
                Menu
              </button>
              <div className="text-sm font-semibold">Chat</div>
              <div className="text-xs text-slate-400">
                {activeSessionId ? "Saved" : "New session"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {canUpload && (
                <label className="cursor-pointer rounded-xl border border-line bg-white/0 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5">
                  {uploading ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner /> Uploading…
                    </span>
                  ) : (
                    "Upload PDF"
                  )}
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => onUpload(e.target.files?.[0])}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </header>

          {uploadStatus && (
            <div className="border-b border-line px-4 py-2 text-sm text-slate-200">
              {uploadStatus}
            </div>
          )}

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-auto px-4 py-4">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
              {messages.length === 0 && (
                <div className="rounded-2xl border border-line bg-white/5 p-5 text-sm text-slate-300">
                  Ask a question about your company’s documents. OpsMind will answer using only the retrieved context.
                </div>
              )}

              {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={idx}
                    className={[
                      "flex",
                      isUser ? "justify-end" : "justify-start",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        isUser
                          ? "bg-gradient-to-br from-neutral-800 to-neutral-900 text-slate-100 ring-1 ring-white/10"
                          : "bg-white/5 text-slate-100 ring-1 ring-white/10",
                      ].join(" ")}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200 ring-1 ring-white/10">
                    <Spinner /> Thinking…
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-line px-4 py-3">
            <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading) sendQuestion();
                  }
                }}
                placeholder="Message OpsMind AI…"
                className="min-h-[44px] flex-1 resize-none rounded-2xl border border-line bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-accent/60"
              />
              <button
                onClick={sendQuestion}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-blue-500 px-4 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
              >
                {loading ? <Spinner /> : null}
                {loading ? "Processing…" : "Send"}
              </button>
            </div>
            <div className="mx-auto mt-2 max-w-3xl text-xs text-slate-500">
              Press Enter to send, Shift+Enter for a new line.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

