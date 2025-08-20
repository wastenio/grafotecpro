import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCaseDetail } from "../../api/cases";

interface Case {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  documents: Document[]; // <--- adiciona aqui
  final_report?: string | null; // opcional
}

const CaseDetail = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      if (!caseId) return;
      const data = await getCaseDetail(Number(caseId));
      setCaseData(data);
    };
    fetchCase();
  }, [caseId]);

  if (!caseData) return <p>Carregando...</p>;

  return (
    <div>
      <h2>{caseData.title}</h2>
      <p>Status: {caseData.status}</p>
      <p>{caseData.description}</p>
      <p>Criado em: {new Date(caseData.created_at).toLocaleString()}</p>

      {/* Link para lista de análises */}
      <Link to={`/cases/${caseId}/analyses`} style={{ display: "block", margin: "1rem 0" }}>
        Ver Análises
      </Link>

      {/* Link para criar nova análise */}
      <Link to={`/cases/${caseId}/analyses/new`} style={{ display: "block", marginBottom: "1rem" }}>
        Criar Nova Análise
      </Link>

      {/* Caso queira depois adicionar documentos ou relatórios finais */}
      <h3>Documentos</h3>
      {caseData.documents?.length === 0 ? (
        <p>Nenhum documento enviado.</p>
      ) : (
        <ul>
          {caseData.documents.map((doc: any) => (
            <li key={doc.id}>{doc.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CaseDetail;
