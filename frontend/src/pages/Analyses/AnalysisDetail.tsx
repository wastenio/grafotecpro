// src/pages/analyses/AnalysisDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useAnalysis } from "../../api/hooks/useAnalyses";
import { useComparisonsByAnalysis } from "../../api/hooks/useComparisons";
import { EmptyState } from "../../components/common/EmptyState";

export const AnalysisDetail = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const { data: analysis, isLoading, error } = useAnalysis(Number(analysisId));
  const { data: comparisons } = useComparisonsByAnalysis(Number(analysisId));

  if (isLoading) return <p>Carregando análise...</p>;
  if (error || !analysis) return <p>Erro ao carregar a análise</p>;

  return (
    <div>
      <h1>{analysis.title}</h1>
      <p>Metodologia: {analysis.methodology || "-"}</p>
      <p>Conclusão: {analysis.conclusion || "-"}</p>

      <h2 className="mt-4">Comparações</h2>
      {!comparisons || comparisons.length === 0 ? (
        <EmptyState message="Nenhuma comparação encontrada" />
      ) : (
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
      )}
      <Link to={`/analyses/${analysisId}/comparisons/create`} className="btn btn-primary mt-3">
        Criar Comparação
      </Link>
    </div>
  );
};
