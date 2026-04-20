import api from "./client";

export const authApi = {
  signup: (payload) => api.post("/auth/signup", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
};

export const problemApi = {
  list: (params) => api.get("/problems", { params }),
  detail: (slug) => api.get(`/problems/${slug}`),
};

export const submissionApi = {
  run: (payload) => api.post("/submissions/run", payload),
  submit: (payload) => api.post("/submissions/submit", payload),
  mine: () => api.get("/submissions/mine"),
};

export const leaderboardApi = {
  global: () => api.get("/leaderboard/global"),
  weekly: () => api.get("/leaderboard/weekly"),
};

export const userApi = {
  profile: () => api.get("/users/profile"),
};

export const gameApi = {
  start: (payload) => api.post("/game/start", payload),
  getSession: (sessionId) => api.get(`/game/session/${sessionId}`),
  submit: (payload) => api.post("/game/submit", payload),
  finish: (payload) => api.post("/game/finish", payload),
  history: () => api.get("/game/history"),
};
