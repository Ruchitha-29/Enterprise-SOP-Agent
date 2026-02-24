import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

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

function Dashboard() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [matches, setMatches] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [askLoading, setAskLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const decoded = decodeToken(token);
    setUser(decoded || null);
  }, [token]);

  const handleUpload = async () => {
    if (!file) {
      setStatusMessage("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatusMessage("");
      setUploadLoading(true);

      const res = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setStatusMessage(data.message || "Upload successful.");
    } catch (err) {
      console.error(err);
      setStatusMessage(err.message || "Upload failed.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question) {
      setStatusMessage("Please enter a question.");
      return;
    }

    try {
      setStatusMessage("");
      setAskLoading(true);

      const res = await fetch(`${BACKEND_URL}/api/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Query failed");
      }

      setAnswer(data.answer || "No answer returned.");
      setMatches(data.matches || []);
    } catch (err) {
      console.error(err);
      setStatusMessage(err.message || "Query failed.");
    } finally {
      setAskLoading(false);
    }
  };

  const isLoading = uploadLoading || askLoading;

  return (
    <div className="page-root">
      <Navbar user={user} />

      <main className="dashboard-main">
        <section className="dashboard-grid">
          {(user?.role === "admin" || user?.role === "company") && (
            <div className="card card-upload">
              <h2 className="card-title">Upload SOP Document</h2>
              <p className="card-subtitle">
                Ingest internal SOP PDFs into OpsMind&apos;s knowledge brain.
              </p>

              <div className="upload-control">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                  className="file-input"
                />
                <button
                  className="btn btn-secondary"
                  onClick={handleUpload}
                  disabled={uploadLoading}
                >
                  {uploadLoading ? (
                    <span className="btn-content">
                      <span className="spinner small" /> Uploading...
                    </span>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>

              {statusMessage && <div className="status-banner">{statusMessage}</div>}
            </div>
          )}
          <div className="card card-query">
            <h2 className="card-title">Ask about your SOPs</h2>
            <p className="card-subtitle">
              Ask natural language questions grounded in your uploaded documents.
            </p>

            <div className="question-row">
              <input
                type="text"
                className="field-input"
                placeholder="e.g. What is the incident escalation process?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={handleAsk}
                disabled={askLoading}
              >
                {askLoading ? (
                  <span className="btn-content">
                    <span className="spinner small" /> Thinking...
                  </span>
                ) : (
                  "Ask"
                )}
              </button>
            </div>

            <div className="answer-card">
              <div className="answer-label">Assistant</div>
              {isLoading ? (
                <div className="answer-loading">
                  <span className="spinner" />
                  <span>Generating grounded answer...</span>
                </div>
              ) : (
                <p className="answer-text">{answer || "Ask a question to get started."}</p>
              )}
            </div>
          </div>
        </section>

        <section className="card card-chunks">
          <div className="card-header-row">
            <h2 className="card-title">Retrieved Chunks</h2>
            <span className="card-badge">{matches.length} matches</span>
          </div>

          {matches.length === 0 && (
            <p className="card-subtitle">
              Relevant passages from your documents will appear here after you ask a question.
            </p>
          )}

          <div className="chunks-list">
            {matches.map((match, index) => (
              <details key={index} className="chunk-item" open={index === 0}>
                <summary className="chunk-summary">
                  <div className="chunk-meta">
                    <span className="chunk-doc">{match.documentName}</span>
                    {typeof match.score === "number" && (
                      <span className="chunk-score">
                        Score: {match.score.toFixed(3)}
                      </span>
                    )}
                  </div>
                </summary>
                <p className="chunk-content">{match.content}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

