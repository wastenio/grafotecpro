import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComparisonDetail } from "../../api/hooks/comparisons";

interface Comparison {
  id: number;
  pattern_name: string;
  document_name: string;
  similarity_score: number | null;
  automatic_result: string;
  created_at: string;
}

const ComparisonDetail = () => {
  const { comparisonId } = useParams<{ comparisonId: string }>();
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      if (!comparisonId) return;
      try {
        const data = await getComparisonDetail(Number(comparisonId));
        setComparison(data);
      } catch (error) {
        console.error("Erro ao buscar comparação:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [comparisonId]);

  if (loading) return <p>Carregando comparação...</p>;
  if (!comparison) return <p>Comparação não encontrada.</p>;

  return (
    <div>
      <h2>Detalhes da Comparação</h2>
      <p>
        <strong>ID:</strong> {comparison.id}
      </p>
      <p>
        <strong>Pattern:</strong> {comparison.pattern_name}
      </p>
      <p>
        <strong>Documento:</strong> {comparison.document_name}
      </p>
      <p>
        <strong>Similaridade:</strong>{" "}
        {comparison.similarity_score !== null ? comparison.similarity_score : "N/A"}
      </p>
      <p>
        <strong>Resultado Automático:</strong> {comparison.automatic_result}
      </p>
      <p>
        <strong>Criado em:</strong> {new Date(comparison.created_at).toLocaleString()}
      </p>
    </div>
  );
};

export default ComparisonDetail;
