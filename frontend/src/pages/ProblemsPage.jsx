import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { problemApi } from "../lib/api/services";

function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    problemApi.list({ difficulty, search }).then((response) => setProblems(response.data));
  }, [difficulty, search]);

  const filters = useMemo(() => ["", "Easy", "Medium", "Hard"], []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Problems</h2>
      <div className="flex flex-wrap gap-2">
        <input
          className="rounded border-2 border-[#58A6FF] bg-[#0f1625] px-3 py-2"
          placeholder="Search problem"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filters.map((option) => (
          <button
            key={option || "all"}
            type="button"
            onClick={() => setDifficulty(option)}
            className="rounded border-2 border-[#7C3AED] px-3 py-2 text-sm"
          >
            {option || "All"}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border-2 border-[#58A6FF]">
        <table className="w-full border-collapse">
          <thead className="bg-[#13213a]">
            <tr>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Difficulty</th>
              <th className="px-3 py-2 text-left">XP</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id} className="border-t border-[#24334d]">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Link className="text-[#58A6FF]" to={`/problems/${problem.slug}`}>
                      {problem.title}
                    </Link>
                    <Link
                      className="rounded border border-[#3FB950] px-2 py-1 text-xs text-[#3FB950]"
                      to={`/game?problemId=${problem._id}`}
                    >
                      Play
                    </Link>
                  </div>
                </td>
                <td className="px-3 py-2">{problem.difficulty}</td>
                <td className="px-3 py-2">{problem.xpReward}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProblemsPage;
