import React, { useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Preencha todos os campos.");
      return;
    }

    // Simulação de cadastro/login local
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (isRegister) {
      // Cadastro
      const exists = users.find((u: any) => u.email === email);
      if (exists) {
        setMessage("Usuário já existe.");
        return;
      }
      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));
      setMessage("Cadastro realizado! Agora faça login.");
      setIsRegister(false);
    } else {
      // Login
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );
      if (!user) {
        setMessage("Usuário ou senha incorretos.");
        return;
      }
      // Simulação de token
      localStorage.setItem("token", "dummy-token");
      setMessage("Login realizado com sucesso!");
      window.location.href = "/cases"; // redireciona para a área protegida
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>{isRegister ? "Cadastro" : "Login"}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          {isRegister ? "Cadastrar" : "Entrar"}
        </button>
      </form>
      <p
        style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
        onClick={() => {
          setIsRegister(!isRegister);
          setMessage("");
        }}
      >
        {isRegister
          ? "Já tem conta? Faça login"
          : "Não tem conta? Cadastre-se"}
      </p>
    </div>
  );
};

export default Login;
