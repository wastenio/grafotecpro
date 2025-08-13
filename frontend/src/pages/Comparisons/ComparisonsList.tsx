// src/pages/comparisons/ComparisonsList.tsx
import { useParams, Link } from "react-router-dom";
import { useComparisonsByAnalysis } from "../../api/hooks/useComparisons";
import { EmptyState } from "../../components/common/EmptyState";

export const ComparisonsList = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const { data: comparisons, isLoading, error } = useComparisonsByAnalysis(Number(analysisId));

  if (isLoading) return <p>Carregando comparações...</p>;
  if (error) return <p>Erro ao carregar comparações</p>;

  if (!comparisons || comparisons.length === 0) return <EmptyState message="Nenhuma comparação encontrada" />;

  return (
    <div>
      <h1>Comparações da Análise #{analysisId}</h1>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Similaridade</th>
            <th>Resultado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.similarity_score ?? "-"}</td>
              <td>{c.result ?? "-"}</td>
              <td>
                <Link to={`/comparisons/${c.id}`}>Detalhes</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={`/analyses/${analysisId}/comparisons/create`} className="btn btn-primary mt-3">
        Criar Comparação
      </Link>
    </div>
  );
};
