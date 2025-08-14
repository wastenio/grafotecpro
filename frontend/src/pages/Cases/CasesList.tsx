// src/pages/cases/CaseDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useCase } from "@/api/hooks/useCases";
import { useAnalysesByCase } from "@/api/hooks/useAnalyses";
import { useQuesitosByCase } from "@/api/hooks/useQuesitos";
import EmptyState from "@/components/common/EmptyState";

export const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const caseId = Number(id);

  const { data: caseData, isLoading: loadingCase, error: errorCase } = useCase(caseId);
  const { data: analyses, isLoading: loadingAnalyses } = useAnalysesByCase(caseId);
  const { data: quesitos, isLoading: loadingQuesitos } = useQuesitosByCase(caseId);

  if (loadingCase) return <p>Carregando caso...</p>;
  if (errorCase) return <p>Erro ao carregar caso</p>;
  if (!caseData) return <p>Caso não encontrado</p>;

  return (
    <div>
      <h1>Detalhes do Caso: {caseData.title}</h1>
      {caseData.description && <p>{caseData.description}</p>}

      <section className="mt-4">
        <h2>Análises</h2>
        {loadingAnalyses ? (
          <p>Carregando análises...</p>
        ) : !analyses || analyses.length === 0 ? (
          <EmptyState
            title="Nenhuma análise encontrada"
            description="Ainda não existem análises cadastradas para este caso."
            actionLabel="Criar nova análise"
            onAction={() => console.log("Abrir modal de nova análise")}
          />
        ) : (
          <ul>
            {analyses.map((analysis) => (
              <li key={analysis.id}>
                <Link to={`/analyses/${analysis.id}`}>{analysis.title}</Link>
              </li>
            ))}
          </ul>
        )}
        <Link to={`/cases/${caseId}/analyses/create`} className="btn btn-primary mt-2">
          Criar Nova Análise
        </Link>
      </section>

      <section className="mt-4">
        <h2>Quesitos</h2>
        {loadingQuesitos ? (
          <p>Carregando quesitos...</p>
        ) : !quesitos || quesitos.length === 0 ? (
          <EmptyState
            title="Nenhum quesito encontrado"
            description="Ainda não existem quesitos cadastrados para este caso."
            actionLabel="Criar novo quesito"
            onAction={() => console.log("Abrir modal de novo quesito")}
          />
        ) : (
          <ul>
            {quesitos.map((q) => (
              <li key={q.id}>
                <Link to={`/quesitos/${q.id}`}>{q.question}</Link>
              </li>
            ))}
          </ul>
        )}
        <Link to={`/cases/${caseId}/quesitos/create`} className="btn btn-primary mt-2">
          Criar Novo Quesito
        </Link>
      </section>
    </div>
  );
};
