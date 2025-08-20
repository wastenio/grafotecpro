import { useEffect, useState } from "react";
import { getAnalysisDetail } from "../../api/hooks/useAnalyses";
import { useParams } from "react-router-dom";

interface Analysis {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

const AnalysisDetail = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId) return;
      const data = await getAnalysisDetail(Number(analysisId));
      setAnalysis(data);
    };
    fetchAnalysis();
  }, [analysisId]);

  if (!analysis) return <p>Carregando...</p>;

  return (
    <div>
      <h2>{analysis.title}</h2>
      <p>Status: {analysis.status}</p>
      <p>{analysis.description}</p>
      <p>Criado em: {new Date(analysis.created_at).toLocaleString()}</p>
    </div>
  );
};

export default AnalysisDetail;
