// src/pages/cases/CasesList.tsx
import { Link } from "react-router-dom";
import { useCases } from "../../api/hooks/useCases";
import { EmptyState } from "../../components/common/EmptyState";

export const CasesList = () => {
  const { data: cases, isLoading, error } = useCases();

  if (isLoading) return <p>Carregando casos...</p>;
  if (error) return <p>Erro ao carregar casos</p>;

  if (!cases || cases.length === 0) return <EmptyState message="Nenhum caso encontrado" />;

  return (
    <div>
      <h1>Casos</h1>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Criado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{new Date(c.created_at).toLocaleDateString()}</td>
              <td>
                <Link to={`/cases/${c.id}`}>Detalhes</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/cases/create" className="btn btn-primary mt-3">Criar Novo Caso</Link>
    </div>
  );
};
