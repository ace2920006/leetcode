import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { gameApi, problemApi } from "../lib/api/services";

function GameLobbyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const problemIdFromQuery = searchParams.get("problemId") || "";
  const [problems, setProblems] = useState([]);
  const [problemId, setProblemId] = useState(problemIdFromQuery);
  const [language, setLanguage] = useState("python");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    problemApi.list().then((response) => setProblems(response.data));
  }, []);

  const selectedProblem = useMemo(
    () => problems.find((problem) => problem._id === problemId),
    [problems, problemId]
  );

  const handleStart = async () => {
    if (!problemId) return;
    try {
      setError("");
      setStarting(true);
      const { data } = await gameApi.start({ problemId, language, timeLimitSec: 600 });
      navigate(`/game/${data.sessionId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to start game");
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Game Mode Lobby</h2>
      <section className="rounded-lg border-2 border-[#7C3AED] bg-[#10192b] p-4">
        <p className="mb-3 text-sm text-slate-300">
          Pick a problem and language. You will have 10 minutes to solve and maximize score.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <select
            className="rounded border-2 border-[#58A6FF] bg-[#0f1625] px-3 py-2"
            value={problemId}
            onChange={(event) => setProblemId(event.target.value)}
          >
            <option value="">Select Problem</option>
            {problems.map((problem) => (
              <option key={problem._id} value={problem._id}>
                {problem.title} ({problem.difficulty})
              </option>
            ))}
          </select>
          <select
            className="rounded border-2 border-[#58A6FF] bg-[#0f1625] px-3 py-2"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        {selectedProblem && (
          <p className="mt-3 text-sm text-[#58A6FF]">
            Ready: {selectedProblem.title} - Reward Focus: {selectedProblem.xpReward} XP
          </p>
        )}
        {error && <p className="mt-2 text-sm text-[#F85149]">{error}</p>}
        <button
          type="button"
          onClick={handleStart}
          disabled={starting || !problemId}
          className="mt-4 rounded border-2 border-[#3FB950] bg-[#3FB95022] px-4 py-2 font-semibold disabled:opacity-60"
        >
          {starting ? "Starting..." : "Start Challenge"}
        </button>
      </section>
    </div>
  );
}

export default GameLobbyPage;
