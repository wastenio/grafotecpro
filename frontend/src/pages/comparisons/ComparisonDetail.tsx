import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Comparison, getComparisonDetail } from "../../api/hooks/comparisons";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

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

  if (loading) return <Loader />;
  if (!comparison) return <p>Comparação não encontrada.</p>;

  return (
    <div className="p-4">
      <PageHeader title={comparison.title || "Comparação"} />

      <p><strong>Status:</strong> {comparison.status || "Pendente"}</p>
      <p><strong>Descrição:</strong> {comparison.description || "N/A"}</p>
      {comparison.pattern_name && <p><strong>Padrão:</strong> {comparison.pattern_name}</p>}
      {comparison.document_name && <p><strong>Documento:</strong> {comparison.document_name}</p>}
      {comparison.automatic_result && <p><strong>Resultado AI:</strong> {comparison.automatic_result}</p>}
      {comparison.similarity_score !== undefined && (
        <p><strong>Score de similaridade:</strong> {comparison.similarity_score?.toFixed(2)}</p>
      )}
    </div>
  );
};

export default ComparisonDetail;
