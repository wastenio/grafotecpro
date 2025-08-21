// src/pages/analyses/AnalysisDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Analysis as AnalysisType,
  getAnalysisDetail,
  uploadAnalysisDocument,
  runAIAnalysis,
} from "../../api/hooks/useAnalyses";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

const AnalysisDetail = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [analysis, setAnalysis] = useState<AnalysisType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId) return;
      setLoading(true);
      try {
        const data = await getAnalysisDetail(Number(analysisId));
        setAnalysis(data);
      } catch (err) {
        console.error("Erro ao buscar análise:", err);
        setError("Não foi possível carregar a análise.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId]);

  const handleFileUpload = async () => {
    if (!analysis || !file) return;
    setLoading(true);
    try {
      await uploadAnalysisDocument(analysis.id, file);
      const updated = await getAnalysisDetail(analysis.id);
      setAnalysis(updated);
      alert("Documento enviado com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar documento:", err);
      alert("Erro ao enviar documento.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI = async () => {
    if (!analysis) return;
    setLoading(true);
    try {
      await runAIAnalysis(analysis.id);
      const updated = await getAnalysisDetail(analysis.id);
      setAnalysis(updated);
      alert("Análise AI executada com sucesso!");
    } catch (err) {
      console.error("Erro ao rodar AI:", err);
      alert("Erro ao rodar análise AI.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!analysis) return <p>Carregando análise...</p>;

  return (
    <div className="p-4">
      <PageHeader title={analysis.observation || "Sem título"} />

      <div className="mb-4">
        <p><strong>Status:</strong> {analysis.conclusion ? "Concluída" : "Pendente"}</p>
        <p><strong>Criado em:</strong> {analysis.created_at ? new Date(analysis.created_at).toLocaleString() : "N/A"}</p>
        <p><strong>Descrição:</strong> {analysis.methodology || "Sem descrição"}</p>
        <p><strong>Conclusão:</strong> {analysis.conclusion || "N/A"}</p>
      </div>

      <div className="mb-4 border-t pt-4">
        <h3 className="text-lg font-bold mb-2">Upload de Documento</h3>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button
          onClick={handleFileUpload}
          disabled={loading || !file}
          className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Enviar
        </button>
      </div>

      <div className="mb-4 border-t pt-4">
        <h3 className="text-lg font-bold mb-2">Análise Automática (AI)</h3>
        <button
          onClick={handleRunAI}
          disabled={loading}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
        >
          Rodar AI
        </button>
      </div>
    </div>
  );
};

export default AnalysisDetail;
