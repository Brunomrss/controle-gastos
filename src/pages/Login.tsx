import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    // login OK
    navigate("/");
  }

  return (
  <div style={{ maxWidth: 400, margin: "100px auto" }}>
    <h1>Login</h1>

    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>

    {/* 👇 botão de criar conta */}
    <p style={{ marginTop: 16 }}>
      Ainda não tem conta?{" "}
      <button
        type="button"
        onClick={() => navigate("/register")}
        style={{
          background: "none",
          border: "none",
          color: "blue",
          cursor: "pointer",
          padding: 0,
        }}
      >
        Criar conta
      </button>
    </p>
  </div>
  );
}