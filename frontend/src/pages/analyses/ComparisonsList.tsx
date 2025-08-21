import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Comparison, getComparisons } from "../../api/hooks/comparisons";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

const ComparisonsList = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparisons = async () => {
      if (!analysisId) return;
      try {
        const data = await getComparisons(Number(analysisId));
        setComparisons(data);
      } catch (error) {
        console.error("Erro ao buscar comparações:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComparisons();
  }, [analysisId]);

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <PageHeader
        title="Comparações"
        actionLabel="Nova Comparação"
        actionLink={`/analyses/${analysisId}/comparisons/new`}
      />

      {comparisons.length === 0 ? (
        <p>Nenhuma comparação encontrada.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {comparisons.map((comp) => (
            <li key={comp.id} className="border p-3 rounded shadow-sm hover:shadow-md">
              <Link
                to={`/comparisons/${comp.id}`}
                className="font-semibold text-blue-600 hover:underline"
              >
                {comp.title || "Sem título"}
              </Link>
              <p>Status: {comp.status || "Pendente"}</p>
              {comp.automatic_result && <p>Resultado AI: {comp.automatic_result}</p>}
              {comp.similarity_score !== undefined && (
                <p>Score de similaridade: {comp.similarity_score?.toFixed(2)}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComparisonsList;
