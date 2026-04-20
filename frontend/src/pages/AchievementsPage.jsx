import { m } from "framer-motion";

const badges = [
  { title: "Beginner Badge", unlocked: true },
  { title: "7 Day Streak", unlocked: true },
  { title: "100 Problems Solved", unlocked: false },
];

function AchievementsPage() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Achievements</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {badges.map((badge) => (
          <m.div
            key={badge.title}
            whileHover={{ scale: 1.03 }}
            className={`rounded-lg border-2 p-4 ${
              badge.unlocked ? "border-[#3FB950] bg-[#3FB9501a]" : "border-[#475569] bg-[#1f2937]"
            }`}
          >
            <p className="font-semibold">{badge.title}</p>
            <p className="text-sm">{badge.unlocked ? "Unlocked" : "Locked"}</p>
          </m.div>
        ))}
      </div>
    </div>
  );
}

export default AchievementsPage;
