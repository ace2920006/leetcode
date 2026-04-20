import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import DashboardPage from "./pages/DashboardPage";
import LearnPage from "./pages/LearnPage";
import ProblemsPage from "./pages/ProblemsPage";
import EditorPage from "./pages/EditorPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import AchievementsPage from "./pages/AchievementsPage";
import AuthPage from "./pages/AuthPage";
import GameLobbyPage from "./pages/GameLobbyPage";
import GameSessionPage from "./pages/GameSessionPage";
import GameResultPage from "./pages/GameResultPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problems/:slug" element={<EditorPage />} />
          <Route path="/game" element={<GameLobbyPage />} />
          <Route path="/game/:sessionId" element={<GameSessionPage />} />
          <Route path="/game/:sessionId/result" element={<GameResultPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
