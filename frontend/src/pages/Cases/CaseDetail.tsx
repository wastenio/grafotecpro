// src/pages/cases/CaseDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useCase } from "../../api/hooks/useCases";

export const CaseDetail = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { data: caseData, isLoading, error } = useCase(Number(caseId));

  if (isLoading) return <p>Carregando detalhes do caso...</p>;
  if (error || !caseData) return <p>Erro ao carregar o caso</p>;

  return (
    <div>
      <h1>{caseData.title}</h1>
      <p>{caseData.description}</p>
      <p>Criado em: {new Date(caseData.created_at).toLocaleDateString()}</p>

      <div className="mt-3">
        <Link to={`/cases/${caseData.id}/analyses`} className="btn btn-secondary me-2">
          Análises
        </Link>
        <Link to={`/cases/${caseData.id}/quesitos`} className="btn btn-secondary">
          Quesitos
        </Link>
      </div>
    </div>
  );
};
