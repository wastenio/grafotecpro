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
  description: string;
  status: string;
  created_at: string;
  documents: Document[];
  final_report?: string | null;
}

const CaseDetail = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      if (!caseId) return;
      try {
        const data = await getCaseDetail(Number(caseId));
        setCaseData(data);
      } catch (error) {
        console.error("Erro ao buscar caso:", error);
      }
    };
    fetchCase();
  }, [caseId]);

  if (!caseData) return <p>Carregando caso...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h2>{caseData.title}</h2>
      <p><strong>Status:</strong> {caseData.status}</p>
      <p><strong>Criado em:</strong> {new Date(caseData.created_at).toLocaleString()}</p>
      <p><strong>Descrição:</strong> {caseData.description}</p>

      <div style={{ margin: "1.5rem 0" }}>
        <Link 
          to={`/cases/${caseId}/analyses`} 
          style={{ 
            display: "inline-block",
            padding: "0.5rem 1rem",
            marginRight: "1rem",
            backgroundColor: "#4A90E2",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px"
          }}
        >
          Ver Análises
        </Link>

        <Link 
          to={`/cases/${caseId}/analyses/new`} 
          style={{ 
            display: "inline-block",
            padding: "0.5rem 1rem",
            backgroundColor: "#50E3C2",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px"
          }}
        >
          Criar Nova Análise
        </Link>
      </div>

      <h3>Documentos</h3>
      {caseData.documents?.length === 0 ? (
        <p>Nenhum documento enviado.</p>
      ) : (
        <ul>
          {caseData.documents.map((doc) => (
            <li key={doc.id}>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: "#4A90E2" }}>
                {doc.name}
              </a>
            </li>
          ))}
        </ul>
      )}

      {caseData.final_report && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Relatório Final:</strong>{" "}
          <a href={caseData.final_report} target="_blank" rel="noopener noreferrer" style={{ color: "#D0021B" }}>
            Baixar
          </a>
        </div>
      )}
    </div>
  );
};

export default CaseDetail;
