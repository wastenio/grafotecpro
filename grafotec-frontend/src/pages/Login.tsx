import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login tentado:", { email, password });
    // futura integração com backend
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh", 
      backgroundColor: "#f5f5f5" 
    }}>
      <div style={{ 
        background: "#fff", 
        padding: "2rem", 
        borderRadius: "8px", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
        width: "100%", 
        maxWidth: "400px" 
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Acessar Sistema
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Email
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ 
                width: "100%", 
                padding: "0.75rem", 
                border: "1px solid #ccc", 
                borderRadius: "4px" 
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Senha
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ 
                width: "100%", 
                padding: "0.75rem", 
                border: "1px solid #ccc", 
                borderRadius: "4px" 
              }}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              width: "100%", 
              padding: "0.75rem", 
              backgroundColor: "#1976d2", 
              color: "#fff", 
              fontWeight: "bold", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer" 
            }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
