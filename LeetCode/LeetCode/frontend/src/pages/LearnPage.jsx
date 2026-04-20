import { m } from "framer-motion";

const levels = [
  { title: "Variables", status: "completed" },
  { title: "Loops", status: "in-progress" },
  { title: "Functions", status: "locked" },
];

function LearnPage() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Learning Worlds</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {levels.map((level, index) => (
          <m.article
            key={level.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-lg border-2 border-[#7C3AED] bg-[#10192b] p-4"
          >
            <p className="font-bold">{level.title}</p>
            <p className="mt-2 text-sm capitalize text-slate-300">{level.status}</p>
          </m.article>
        ))}
      </div>
    </div>
  );
}

export default LearnPage;
