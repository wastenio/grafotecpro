import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCaseDetail } from "../../api/cases";

interface Document {
  id: number;
  name: string;
  url: string;
}

interface Case {
  id: number;
  title: string;
  description?: string;
  status?: string;
  created_at?: string;
  documents?: Document[];
  final_report?: string | null;
}

const CaseDetail = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCase = async () => {
      if (!caseId) return;
      setLoading(true);
      try {
        const data = await getCaseDetail(Number(caseId));
        setCaseData(data);
      } catch (err) {
        console.error("Erro ao buscar caso:", err);
        setError("Não foi possível carregar o caso.");
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [caseId]);

  if (loading) return <p>Carregando caso...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!caseData) return <p>Case não encontrado.</p>;

  const formattedDate = caseData.created_at
    ? new Date(caseData.created_at).toLocaleString()
    : "Data não disponível";

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h2 className="text-2xl font-bold mb-2">{caseData.title}</h2>
      <p><strong>Status:</strong> {caseData.status || "Não informado"}</p>
      <p><strong>Criado em:</strong> {formattedDate}</p>
      <p><strong>Descrição:</strong> {caseData.description || "Sem descrição"}</p>

      <div className="my-4 flex gap-2">
        <Link
          to={`/cases/${caseId}/analyses`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Ver Análises
        </Link>

        <Link
          to={`/cases/${caseId}/analyses/new`}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Criar Nova Análise
        </Link>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Documentos</h3>
      {caseData.documents && caseData.documents.length > 0 ? (
        <ul className="list-disc ml-5">
          {caseData.documents.map((doc) => (
            <li key={doc.id}>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {doc.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum documento enviado.</p>
      )}

      {caseData.final_report && (
        <div className="mt-4">
          <strong>Relatório Final:</strong>{" "}
          <a
            href={caseData.final_report}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:underline"
          >
            Baixar
          </a>
        </div>
      )}
    </div>
  );
};

export default CaseDetail;
