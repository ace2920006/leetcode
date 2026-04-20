import { useEffect, useState } from "react";
import { gameApi, userApi } from "../lib/api/services";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    userApi.profile().then((response) => setProfile(response.data));
    gameApi.history().then((response) => setGameHistory(response.data));
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Profile</h2>
      <section className="rounded-lg border-2 border-[#58A6FF] bg-[#10192b] p-4">
        <p className="text-xl font-semibold">{profile.name}</p>
        <p className="text-sm text-slate-300">{profile.email}</p>
        <p className="mt-2">Level {profile.level} - {profile.xp} XP</p>
        <p>Streak: {profile.streak} days</p>
      </section>
      <section className="rounded-lg border-2 border-[#7C3AED] bg-[#10192b] p-4">
        <h3 className="mb-2 font-semibold">Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {(profile.achievements || []).map((item) => (
            <span key={item} className="rounded border border-[#3FB950] px-2 py-1 text-sm">
              {item}
            </span>
          ))}
        </div>
      </section>
      <section className="rounded-lg border-2 border-[#FFD700] bg-[#10192b] p-4">
        <h3 className="mb-2 font-semibold text-[#FFD700]">Recent Game Sessions</h3>
        {gameHistory.length === 0 ? (
          <p className="text-sm text-slate-300">No game sessions yet. Start one from Game Mode.</p>
        ) : (
          <div className="space-y-2">
            {gameHistory.map((entry) => (
              <div key={entry._id} className="rounded border border-[#334155] px-3 py-2 text-sm">
                <p className="font-medium">{entry.problemId?.title || "Challenge"}</p>
                <p className="text-slate-300">
                  Score {entry.finalScore} | Attempts {entry.attemptCount} | Time {entry.timeSpentSec}s
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
