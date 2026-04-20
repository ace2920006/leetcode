import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { m } from "framer-motion";
import Editor from "@monaco-editor/react";
import { gameApi } from "../lib/api/services";

const defaultSnippets = {
  python: 'print("Hello World")',
  java: "class Main { public static void main(String[] args) {} }",
  cpp: "#include <iostream>\nint main() { return 0; }",
};

function GameSessionPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [code, setCode] = useState(defaultSnippets.python);
  const [remainingSec, setRemainingSec] = useState(600);
  const [attemptCount, setAttemptCount] = useState(0);
  const [statusText, setStatusText] = useState("Submit to check hidden tests.");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    gameApi.getSession(sessionId).then((response) => {
      setSession(response.data);
      setCode(defaultSnippets[response.data.language] || defaultSnippets.python);
    });
  }, [sessionId]);

  useEffect(() => {
    if (!session || session.status === "completed") return undefined;

    const timer = setInterval(() => {
      const now = Date.now();
      const startedAt = new Date(session.startedAt).getTime();
      const spent = Math.floor((now - startedAt) / 1000);
      const nextRemaining = Math.max(0, session.timeLimitSec - spent);
      setRemainingSec(nextRemaining);

      if (nextRemaining <= 0) {
        clearInterval(timer);
        gameApi.finish({ sessionId }).then(() => navigate(`/game/${sessionId}/result`));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session, sessionId, navigate]);

  const timerLabel = useMemo(() => {
    const min = String(Math.floor(remainingSec / 60)).padStart(2, "0");
    const sec = String(remainingSec % 60).padStart(2, "0");
    return `${min}:${sec}`;
  }, [remainingSec]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const { data } = await gameApi.submit({ sessionId, code });
      setAttemptCount(data.attemptCount);
      setStatusText(data.message);

      if (data.status === "completed") {
        navigate(`/game/${sessionId}/result`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) return <p>Loading game session...</p>;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
      <section className="rounded-lg border-2 border-[#58A6FF] bg-[#10192b] p-4">
        <h2 className="mb-2 text-xl font-bold">{session.problemId?.title || "Game Challenge"}</h2>
        <p className="mb-3 text-sm text-slate-300">{session.problemId?.description}</p>
        <div className="space-y-2 text-sm">
          <p>
            Difficulty: <span className="font-semibold">{session.problemId?.difficulty}</span>
          </p>
          <p>
            Attempts: <span className="font-semibold">{attemptCount}</span>
          </p>
        </div>
        <m.div
          key={timerLabel}
          initial={{ scale: 1.05, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 inline-block rounded border-2 border-[#FFD700] bg-[#FFD70022] px-3 py-2 font-mono text-lg text-[#FFD700]"
        >
          {timerLabel}
        </m.div>
      </section>

      <section className="space-y-3 rounded-lg border-2 border-[#7C3AED] bg-[#10192b] p-3">
        <Editor
          height="380px"
          theme="vs-dark"
          language={session.language === "cpp" ? "cpp" : session.language}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-300">{statusText}</p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded border-2 border-[#3FB950] bg-[#3FB95022] px-3 py-1 font-semibold disabled:opacity-60"
          >
            {submitting ? "Checking..." : "Submit"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default GameSessionPage;
