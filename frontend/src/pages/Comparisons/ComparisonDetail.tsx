// src/pages/comparisons/ComparisonDetail.tsx
import { useParams } from "react-router-dom";
import { useComparisonDetail } from "../../api/hooks/useComparisons";
import SideBySideViewer from "@/components/analysis/SideBySideViewer";

export const ComparisonDetail = () => {
  const { comparisonId } = useParams<{ comparisonId: string }>();
  const { data: comparison, isLoading, error } = useComparisonDetail(Number(comparisonId));

  if (isLoading) return <p>Carregando comparação...</p>;
  if (error || !comparison) return <p>Erro ao carregar comparação</p>;

  // URLs dos documentos, se existirem
  const leftUrl = comparison.left_document_version?.file_url ?? null;
  const rightUrl = comparison.right_document_version?.file_url ?? null;

  return (
    <div>
      <h1>Comparação #{comparison.id}</h1>
      <p>Analysis ID: {comparison.analysis_id}</p>
      <p>Similaridade: {comparison.similarity_score ?? "-"}</p>
      <p>Resultado: {comparison.result ?? "-"}</p>
      <p>Criado em: {new Date(comparison.created_at).toLocaleString()}</p>

      <h2 className="mt-4">Visualização lado a lado</h2>
      <SideBySideViewer leftUrl={leftUrl} rightUrl={rightUrl} height={300} />
    </div>
  );
};
