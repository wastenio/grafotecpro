import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Analysis as AnalysisType,
  getAnalysisDetail,
  uploadAnalysisDocument,
  runAIAnalysis
} from "../../api/hooks/useAnalyses";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";

const AnalysisDetail = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [analysis, setAnalysis] = useState<AnalysisType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId) return;
      setLoading(true);
      try {
        const data = await getAnalysisDetail(Number(analysisId));
        setAnalysis(data);
      } catch (error) {
        console.error("Erro ao buscar análise:", error);
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
      const updatedAnalysis = await getAnalysisDetail(analysis.id);
      setAnalysis(updatedAnalysis);
      alert("Documento enviado com sucesso!");
    } catch (error) {
      console.error(error);
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
      const updatedAnalysis = await getAnalysisDetail(analysis.id);
      setAnalysis(updatedAnalysis);
      alert("Análise AI executada com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao rodar análise AI.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analysis) return <Loader />;

  return (
    <div>
      <PageHeader title={analysis.observation || "Análise"} />
      <div className="border rounded shadow p-4">
        <h2 className="text-xl font-bold mb-2">{analysis.observation || "Sem título"}</h2>
        <p className="text-gray-600 mb-1"><strong>Status:</strong> {analysis.conclusion ? "Concluída" : "Pendente"}</p>
        <p className="text-gray-600 mb-1">
          <strong>Criado em:</strong> {analysis.created_at ? new Date(analysis.created_at).toLocaleString() : "N/A"}
        </p>
        <p className="text-gray-700 mb-2"><strong>Descrição:</strong> {analysis.methodology || "Sem descrição"}</p>

        <hr className="my-3"/>

        <div className="mb-3">
          <h3 className="font-semibold mb-2">Upload de Documento</h3>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button
            onClick={handleFileUpload}
            disabled={loading || !file}
            className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Enviar
          </button>
        </div>

        <hr className="my-3"/>

        <div>
          <h3 className="font-semibold mb-2">Análise Automática (AI)</h3>
          <button
            onClick={handleRunAI}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Rodar AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetail;
