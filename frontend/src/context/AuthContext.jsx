import { createContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../lib/api/services";
import { setAuthToken } from "../lib/api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      authApi
        .me()
        .then((response) => setUser(response.data))
        .catch(() => {
          localStorage.removeItem("token");
          setToken("");
          setUser(null);
        });
    }
  }, [token]);

  const login = (nextToken, nextUser) => {
    localStorage.setItem("token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, setUser, login, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;
