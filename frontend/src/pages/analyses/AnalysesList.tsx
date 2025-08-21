import { useEffect, useState } from "react";
import { Analysis as AnalysisType, getAnalyses } from "../../api/hooks/useAnalyses";
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
      try {
        const data: AnalysisType[] = await getAnalyses(Number(caseId));
        // Mapear campos do backend para o formato esperado no frontend
        const mapped: Analysis[] = data.map(a => ({
          id: a.id,
          title: a.observation || "Sem título",
          description: a.methodology || "",
          status: a.conclusion ? "Concluída" : "Pendente",
          created_at: a.created_at || "",
        }));
        setAnalyses(mapped);
      } catch (error) {
        console.error("Erro ao buscar análises:", error);
      }
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
