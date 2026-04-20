import useAuth from "../context/useAuth";
import Card from "../components/ui/Card";
import XPProgress from "../components/game/XPProgress";

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Daily Challenge">
        <p className="mb-3 text-sm text-slate-300">Solve today's warmup challenge to keep your streak alive.</p>
        <a href="/problems/print-hello" className="inline-block rounded border-2 border-[#3FB950] px-3 py-2 font-semibold">
          Solve Now
        </a>
      </Card>
      <Card title="Progress">
        <XPProgress xp={user?.xp || 0} level={user?.level || 1} />
        <p className="mt-3 text-sm">Current streak: {user?.streak || 0} days</p>
      </Card>
      <Card title="Continue Learning">
        <p className="text-sm text-slate-300">Resume your learning world and unlock the next topic.</p>
      </Card>
      <Card title="Leaderboard Preview">
        <p className="text-sm text-slate-300">Jump to rankings to see where you stand this week.</p>
      </Card>
    </div>
  );
}

export default DashboardPage;
