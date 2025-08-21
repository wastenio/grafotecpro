// src/pages/cases/CaseDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCaseDetail, Case as CaseType } from "../../api/cases";

const CaseDetail = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseData, setCaseData] = useState<CaseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCase = async () => {
      if (!caseId) return;
      setLoading(true);
      try {
        const data = await getCaseDetail(Number(caseId));
        setCaseData(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o caso.");
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [caseId]);

  if (loading) return <p>Carregando caso...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!caseData) return <p>Case não encontrado.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">{caseData.title}</h2>
      <p><strong>Status:</strong> {caseData.status || "Não informado"}</p>
      <p><strong>Criado em:</strong> {caseData.created_at ? new Date(caseData.created_at).toLocaleString() : "N/A"}</p>
      <p><strong>Descrição:</strong> {caseData.description || "Sem descrição"}</p>

      <div className="my-4 flex gap-2">
        <Link to={`/cases/${caseId}/analyses`} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Ver Análises</Link>
        <Link to={`/cases/${caseId}/analyses/new`} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Criar Nova Análise</Link>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Documentos</h3>
      {caseData.documents && caseData.documents.length > 0 ? (
        <ul className="list-disc ml-5">
          {caseData.documents.map((doc) => (
            <li key={doc.id}>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{doc.name}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum documento enviado.</p>
      )}

      {caseData.final_report && (
        <div className="mt-4">
          <strong>Relatório Final:</strong>{" "}
          <a href={caseData.final_report} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Baixar</a>
        </div>
      )}
    </div>
  );
};

export default CaseDetail;
