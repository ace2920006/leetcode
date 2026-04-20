import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../lib/api/services";
import useAuth from "../context/useAuth";

function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      const call = mode === "signup" ? authApi.signup : authApi.login;
      const { data } = await call(form);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D1117] p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-lg border-4 border-[#58A6FF] bg-[#111b2c] p-6 shadow-[8px_8px_0_#7C3AED]"
      >
        <h1 className="mb-5 text-2xl font-extrabold">{mode === "signup" ? "Create Account" : "Sign In"}</h1>
        {mode === "signup" && (
          <input
            className="mb-3 w-full rounded border-2 border-[#58A6FF] bg-[#0d1117] p-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          className="mb-3 w-full rounded border-2 border-[#58A6FF] bg-[#0d1117] p-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="mb-4 w-full rounded border-2 border-[#58A6FF] bg-[#0d1117] p-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="mb-3 text-sm text-[#F85149]">{error}</p>}
        <button type="submit" className="w-full rounded border-2 border-[#3FB950] bg-[#3FB95022] p-2 font-semibold">
          {mode === "signup" ? "Create Account" : "Login"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          className="mt-3 w-full text-sm text-[#58A6FF]"
        >
          {mode === "signup" ? "Already have an account?" : "Need an account?"}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
