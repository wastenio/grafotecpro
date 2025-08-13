// src/pages/Dashboard.tsx
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="mb-4">Bem-vindo ao sistema! Aqui você pode acessar rapidamente os módulos:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/cases"
          className="p-6 bg-blue-100 rounded-lg hover:bg-blue-200 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Casos</h2>
          <p>Visualizar e gerenciar todos os casos.</p>
        </Link>

        <Link
          to="/analyses"
          className="p-6 bg-green-100 rounded-lg hover:bg-green-200 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Análises</h2>
          <p>Visualizar e criar análises dentro dos casos.</p>
        </Link>

        <Link
          to="/quesitos"
          className="p-6 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Quesitos</h2>
          <p>Responder ou acompanhar quesitos dos peritos.</p>
        </Link>

        <Link
          to="/comparisons"
          className="p-6 bg-purple-100 rounded-lg hover:bg-purple-200 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Comparações</h2>
          <p>Acessar comparações de documentos lado a lado.</p>
        </Link>
      </div>
    </div>
  );
}
