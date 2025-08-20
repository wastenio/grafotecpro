import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getComparisons } from "../../api/hooks/comparisons";

interface Comparison {
  id: number;
  title: string;
  status: string;
}

const ComparisonsList = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [comparisons, setComparisons] = useState<Comparison[]>([]);

  useEffect(() => {
    const fetchComparisons = async () => {
      if (!analysisId) return;
      const data = await getComparisons(Number(analysisId));
      setComparisons(data);
    };
    fetchComparisons();
  }, [analysisId]);

  return (
    <div>
      <h2>Comparações da Análise #{analysisId}</h2>
      <Link to={`/analysis/${analysisId}/comparisons/new`}>Criar Nova Comparação</Link>
      {comparisons.length === 0 ? (
        <p>Nenhuma comparação criada.</p>
      ) : (
        <ul>
          {comparisons.map((c) => (
            <li key={c.id}>
              <Link to={`/comparisons/${c.id}`}>{c.title}</Link> - {c.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComparisonsList;
