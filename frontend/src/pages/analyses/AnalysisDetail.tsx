import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Analysis as AnalysisType, getAnalysisDetail, uploadAnalysisDocument, runAIAnalysis } from "../../api/hooks/useAnalyses";

const AnalysisDetail = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [analysis, setAnalysis] = useState<AnalysisType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Buscar detalhes da análise
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId) return;
      try {
        const data = await getAnalysisDetail(Number(analysisId));
        setAnalysis(data);
      } catch (error) {
        console.error("Erro ao buscar análise:", error);
      }
    };
    fetchAnalysis();
  }, [analysisId]);

  // Upload de documento
  const handleFileUpload = async () => {
    if (!analysis || !file) return;
    setLoading(true);
    try {
      await uploadAnalysisDocument(analysis.id, file);
      const updatedAnalysis = await getAnalysisDetail(analysis.id);
      setAnalysis(updatedAnalysis);
      alert("Documento enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar documento:", error);
      alert("Erro ao enviar documento.");
    } finally {
      setLoading(false);
    }
  };

  // Rodar análise AI
  const handleRunAI = async () => {
    if (!analysis) return;
    setLoading(true);
    try {
      await runAIAnalysis(analysis.id);
      const updatedAnalysis = await getAnalysisDetail(analysis.id);
      setAnalysis(updatedAnalysis);
      alert("Análise AI executada com sucesso!");
    } catch (error) {
      console.error("Erro ao rodar AI:", error);
      alert("Erro ao rodar análise AI.");
    } finally {
      setLoading(false);
    }
  };

  if (!analysis) return <p>Carregando análise...</p>;

  return (
    <div>
      <h2>{analysis.title}</h2>
      <p><strong>Status:</strong> {analysis.status}</p>
      <p><strong>Criado em:</strong> {analysis.created_at ? new Date(analysis.created_at).toLocaleString() : "N/A"}</p>
      <p><strong>Descrição:</strong> {analysis.description}</p>

      <hr />

      <div>
        <h3>Upload de Documento</h3>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={handleFileUpload} disabled={loading || !file}>Enviar</button>
      </div>

      <hr />

      <div>
        <h3>Análise Automática (AI)</h3>
        <button onClick={handleRunAI} disabled={loading}>Rodar AI</button>
      </div>
    </div>
  );
};

export default AnalysisDetail;
