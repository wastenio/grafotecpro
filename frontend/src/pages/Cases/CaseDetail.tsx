// src/pages/cases/CaseDetail.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCase } from "@/api/hooks/useCases";
import { useAnalysesByCase } from "@/api/hooks/useAnalyses";
import { useQuesitosByCase } from "@/api/hooks/useQuesitos";
import { DataTable } from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";

export const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const caseId = Number(id);
  const navigate = useNavigate();

  const { data: caseData, isLoading: loadingCase, error: errorCase } = useCase(caseId);
  const { data: analyses, isLoading: loadingAnalyses } = useAnalysesByCase(caseId);
  const { data: quesitos, isLoading: loadingQuesitos } = useQuesitosByCase(caseId);

  if (loadingCase) return <p>Carregando caso...</p>;
  if (errorCase) return <p>Erro ao carregar caso</p>;
  if (!caseData) return <p>Caso não encontrado</p>;

  const handleCreateAnalysis = () => navigate(`/cases/${caseId}/analyses/create`);
  const handleCreateQuesito = () => navigate(`/cases/${caseId}/quesitos/create`);

  return (
    <div className="p-4">
      {/* Painel de Detalhes do Caso */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h1 className="text-2xl font-bold mb-2">{caseData.title}</h1>
        {caseData.description && <p className="mb-2">{caseData.description}</p>}
        <div className="text-sm text-gray-600">
          <p>Criado em: {new Date(caseData.created_at).toLocaleDateString()}</p>
          <p>Atualizado em: {new Date(caseData.updated_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Seção de Análises */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Análises</h2>
          <button
            onClick={handleCreateAnalysis}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Criar Nova Análise
          </button>
        </div>

        {loadingAnalyses ? (
          <p>Carregando análises...</p>
        ) : !analyses || analyses.length === 0 ? (
          <EmptyState
            title="Nenhuma análise encontrada"
            description="Ainda não existem análises cadastradas para este caso."
            actionLabel="Criar nova análise"
            onAction={handleCreateAnalysis}
          />
        ) : (
          <DataTable
            data={quesitos ?? []}
            columns={[
              {
                key: "question",
                label: "Pergunta",
                accessor: "question",
                render: (q) => (
                  <Link to={`/quesitos/${q.id}`} className="text-blue-600 hover:underline">
                    {q.question}
                  </Link>
                ),
              },
              {
                key: "created_at",
                label: "Criado em",
                accessor: "created_at",
                render: (q) => new Date(q.created_at).toLocaleDateString(),
              },
              {
                key: "updated_at",
                label: "Atualizado em",
                accessor: "updated_at",
                render: (q) => new Date(q.updated_at).toLocaleDateString(),
              },
            ]}
          />


        )}
      </section>

      {/* Seção de Quesitos */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Quesitos</h2>
          <button
            onClick={handleCreateQuesito}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Criar Novo Quesito
          </button>
        </div>

        {loadingQuesitos ? (
          <p>Carregando quesitos...</p>
        ) : !quesitos || quesitos.length === 0 ? (
          <EmptyState
            title="Nenhum quesito encontrado"
            description="Ainda não existem quesitos cadastrados para este caso."
            actionLabel="Criar novo quesito"
            onAction={handleCreateQuesito}
          />
        ) : (
          <DataTable
            data={quesitos}
            columns={[
              {
                key: "question",
                label: "Pergunta",
                accessor: "question",
                render: (q) => (
                  <Link to={`/quesitos/${q.id}`} className="text-blue-600 hover:underline">
                    {q.question}
                  </Link>
                ),
              },
              {
                key: "created_at",
                label: "Criado em",
                accessor: "created_at",
                render: (q) => new Date(q.created_at).toLocaleDateString(),
              },
              {
                key: "updated_at",
                label: "Atualizado em",
                accessor: "updated_at",
                render: (q) => new Date(q.updated_at).toLocaleDateString(),
              },
            ]}
          />

        )}
      </section>
    </div>
  );
};
