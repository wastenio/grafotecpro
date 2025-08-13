// src/pages/analyses/AnalysesList.tsx
import { useParams, Link } from "react-router-dom";
import { useAnalysesByCase } from "../../api/hooks/useAnalyses";
import { EmptyState } from "../../components/common/EmptyState";

export const AnalysesList = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { data: analyses, isLoading, error } = useAnalysesByCase(Number(caseId));

  if (isLoading) return <p>Carregando análises...</p>;
  if (error) return <p>Erro ao carregar análises</p>;

  if (!analyses || analyses.length === 0) return <EmptyState message="Nenhuma análise encontrada" />;

  return (
    <div>
      <h1>Análises do Caso #{caseId}</h1>
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
          {analyses.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.title}</td>
              <td>{new Date(a.created_at).toLocaleDateString()}</td>
              <td>
                <Link to={`/analyses/${a.id}`}>Detalhes</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={`/cases/${caseId}/analyses/create`} className="btn btn-primary mt-3">
        Criar Nova Análise
      </Link>
    </div>
  );
};
