import { NavLink, Navigate, Outlet } from "react-router-dom";
import { m } from "framer-motion";
import useAuth from "../../context/useAuth";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/learn", label: "Learn" },
  { to: "/problems", label: "Problems" },
  { to: "/game", label: "Game Mode" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/profile", label: "Profile" },
  { to: "/achievements", label: "Achievements" },
];

function AppShell() {
  const { token, user, logout } = useAuth();
  if (!token) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-r-4 border-[#7C3AED] bg-[#0f1625] p-5">
          <p className="mb-8 text-xl font-black tracking-wide text-[#58A6FF]">CODE QUEST</p>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-md border-2 px-3 py-2 font-semibold transition ${
                    isActive
                      ? "border-[#58A6FF] bg-[#58A6FF22]"
                      : "border-transparent hover:border-[#7C3AED]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="p-6 md:p-8">
          <header className="mb-6 flex items-center justify-between rounded-lg border-2 border-[#58A6FF] bg-[#111b2c] p-3">
            <p className="font-semibold">Welcome, {user?.name || "Coder"}</p>
            <button
              type="button"
              onClick={logout}
              className="rounded border-2 border-[#F85149] px-3 py-1 text-sm font-semibold hover:bg-[#F8514920]"
            >
              Logout
            </button>
          </header>
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Outlet />
          </m.div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
