import { useLogin } from "../api/hooks/useAuth";
import { useState } from "react";

export default function LoginPage() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="border p-2 w-full mb-4 rounded"
          required
        />

        <button
          type="submit"
          disabled={login.isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 disabled:opacity-50"
        >
          {login.isPending ? "Entrando..." : "Entrar"}
        </button>

        {login.isError && (
          <p className="text-red-500 text-sm mt-3">
            Erro ao fazer login. Verifique suas credenciais.
          </p>
        )}
      </form>
    </div>
  );
}
