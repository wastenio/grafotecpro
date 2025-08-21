import { useEffect, useState } from "react";
import { getComparisons } from "../../api/hooks/comparisons";
import { Link, useParams } from "react-router-dom";

interface Comparison {
  id: number;
  similarity_score: number | null;
  automatic_result: string;
  pattern_name: string;
  document_name: string;
}

const ComparisonsList = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [comparisons, setComparisons] = useState<Comparison[]>([]);

  useEffect(() => {
    const fetchComparisons = async () => {
      if (!analysisId) return;
      const data = await getComparisons(Number(analysisId));
      setComparisons(data); // se usar paginação, adapte para data.results
    };
    fetchComparisons();
  }, [analysisId]);

  return (
    <div>
      <h2>Comparações da Análise {analysisId}</h2>
      <Link to={`/analyses/${analysisId}/comparisons/new`}>Criar Nova Comparação</Link>
      {comparisons.length === 0 ? (
        <p>Nenhuma comparação encontrada.</p>
      ) : (
        <ul>
          {comparisons.map((comp) => (
            <li key={comp.id}>
              <Link to={`/comparisons/${comp.id}`}>
                {comp.pattern_name} vs {comp.document_name}
              </Link>{" "}
              - Similaridade: {comp.similarity_score ?? "N/A"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComparisonsList;
