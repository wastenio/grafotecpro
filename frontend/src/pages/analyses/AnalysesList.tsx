import { useEffect, useState } from "react";
import { getAnalyses } from "../../api/hooks/useAnalyses";
import { Link, useParams } from "react-router-dom";

interface Analysis {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

const AnalysesList = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!caseId) return;
      const data = await getAnalyses(Number(caseId));
      setAnalyses(data.results); // se o backend paginar, use results
    };
    fetchAnalyses();
  }, [caseId]);

  return (
    <div>
      <h2>Análises do Case {caseId}</h2>
      <Link to={`/cases/${caseId}/analyses/new`}>Criar Nova Análise</Link>
      {analyses.length === 0 ? (
        <p>Nenhuma análise encontrada.</p>
      ) : (
        <ul>
          {analyses.map((analysis) => (
            <li key={analysis.id}>
              <Link to={`/analyses/${analysis.id}`}>{analysis.title}</Link> - {analysis.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnalysesList;
