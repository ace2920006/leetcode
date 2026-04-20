import { useEffect, useState } from "react";
import { leaderboardApi } from "../lib/api/services";

function LeaderboardPage() {
  const [tab, setTab] = useState("global");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const api = tab === "global" ? leaderboardApi.global : leaderboardApi.weekly;
    api().then((response) => setRows(response.data));
  }, [tab]);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Leaderboard</h2>
      <div className="mb-4 flex gap-2">
        {["global", "weekly"].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded border-2 px-3 py-1 ${tab === key ? "border-[#58A6FF]" : "border-[#7C3AED]"}`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border-2 border-[#58A6FF]">
        <table className="w-full">
          <thead className="bg-[#13213a]">
            <tr>
              <th className="px-3 py-2 text-left">Rank</th>
              <th className="px-3 py-2 text-left">User</th>
              <th className="px-3 py-2 text-left">XP</th>
              <th className="px-3 py-2 text-left">Level</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row._id} className="border-t border-[#24334d]">
                <td className="px-3 py-2">{idx + 1}</td>
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2">{row.xp}</td>
                <td className="px-3 py-2">{row.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardPage;
