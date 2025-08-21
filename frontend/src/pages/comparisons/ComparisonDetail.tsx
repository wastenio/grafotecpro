import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Comparison as ComparisonType, getComparisonDetail } from "../../api/hooks/comparisons";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";

const ComparisonDetail = () => {
  const { comparisonId } = useParams<{ comparisonId: string }>();
  const [comparison, setComparison] = useState<ComparisonType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComparison = async () => {
      if (!comparisonId) return;
      setLoading(true);
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

  if (loading || !comparison) return <Loader />;

  return (
    <div>
      <PageHeader title={comparison.title || "Comparação"} />
      <div className="border rounded shadow p-4">
        <h2 className="text-xl font-bold mb-2">{comparison.title || "Sem título"}</h2>
        <p className="text-gray-600 mb-1"><strong>Status:</strong> {comparison.status || "Pendente"}</p>
        <p className="text-gray-600 mb-1">
          Criado em: {comparison.created_at ? new Date(comparison.created_at).toLocaleString() : "N/A"}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Descrição:</strong> {comparison.description || "Sem descrição"}
        </p>

        <hr className="my-3"/>

        <div>
          <h3 className="font-semibold mb-2">Resultado Automático</h3>
          <p>{comparison.automatic_result || "Não disponível"}</p>
          <p className="text-sm text-gray-500 mt-1">
            Similaridade: {comparison.similarity_score ?? "N/A"}
          </p>
          <p className="text-sm text-gray-500">
            Documento: {comparison.document_name || "N/A"}
          </p>
          <p className="text-sm text-gray-500">
            Padrão: {comparison.pattern_name || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonDetail;
