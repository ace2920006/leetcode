import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { m } from "framer-motion";
import { gameApi } from "../lib/api/services";

function GameResultPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    gameApi.getSession(sessionId).then((response) => setSession(response.data));
  }, [sessionId]);

  const scoreBreakdown = useMemo(() => {
    if (!session) return null;

    const base = session.isSolved ? 1000 : 0;
    const timeBonus = Math.max(0, 600 - session.timeSpentSec);
    const attemptPenalty = Math.max(0, (session.attemptCount - 1) * 50);
    return { base, timeBonus, attemptPenalty };
  }, [session]);

  if (!session || !scoreBreakdown) return <p>Loading result...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h2 className="text-2xl font-bold">Challenge Result</h2>
      <m.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-lg border-2 border-[#58A6FF] bg-[#10192b] p-5"
      >
        <p className="text-sm text-slate-300">
          {session.problemId?.title} ({session.problemId?.difficulty})
        </p>
        <p className="mt-2 text-lg font-semibold">
          Status: {session.isSolved ? "Accepted" : "Not Solved"}
        </p>
        <p className="mt-3 text-3xl font-black text-[#FFD700]">Score: {session.finalScore}</p>
        <div className="mt-4 space-y-1 text-sm">
          <p>Base: {scoreBreakdown.base}</p>
          <p>Time bonus: +{scoreBreakdown.timeBonus}</p>
          <p>Attempt penalty: -{scoreBreakdown.attemptPenalty}</p>
          <p>Attempts: {session.attemptCount}</p>
          <p>Time spent: {session.timeSpentSec}s</p>
        </div>
      </m.section>
      <div className="flex gap-2">
        <Link className="rounded border-2 border-[#58A6FF] px-3 py-2" to="/game">
          Play Another
        </Link>
        <Link className="rounded border-2 border-[#7C3AED] px-3 py-2" to="/profile">
          View History
        </Link>
      </div>
    </div>
  );
}

export default GameResultPage;
