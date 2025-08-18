import { useParams, Link } from "react-router-dom";
import { useAnalysis } from "@/api/hooks/useAnalyses";
import { useComparisonsByAnalysis } from "@/api/hooks/useComparisons";
import EmptyState from "@/components/common/EmptyState";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import type { Comparison } from "@/api/types";

export const AnalysisDetail = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const { data: analysis, isLoading, error } = useAnalysis(Number(analysisId));
  const { data: comparisons } = useComparisonsByAnalysis(Number(analysisId));

  if (isLoading) return <p>Carregando análise...</p>;
  if (error || !analysis) return <p>Erro ao carregar a análise</p>;

  const columns: Column<Comparison>[] = [
    { key: "id", label: "ID" },
    {
      key: "similarity_score",
      label: "Similaridade",
      render: (value) => value ?? "-",
    },
    {
      key: "result",
      label: "Resultado",
      render: (value) => value ?? "-",
    },
    {
      key: "actions" as const,
      label: "Ações",
      render: (_value, row) => <Link to={`/comparisons/${row.id}`} className="text-blue-600 hover:underline">Detalhes</Link>,
    },
  ];

  return (
    <div className="p-4">
      {/* Informações do Caso */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold">Caso</h2>
        <p><strong>Título:</strong> {analysis.case.title}</p>
        <p><strong>Status:</strong> {analysis.case.status ?? "Não definido"}</p>
        <p>
          <strong>Perito:</strong>{" "}
          {analysis.case.perito ? `${analysis.case.perito.first_name} ${analysis.case.perito.last_name}` : "Não atribuído"}
        </p>
        <p><strong>Tipo de Fraude:</strong> {analysis.case.fraudType?.name ?? "Não definido"}</p>
      </div>

      {/* Detalhes da Análise */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h1 className="text-2xl font-bold mb-2">{analysis.title}</h1>
        <p><strong>Metodologia:</strong> {analysis.methodology || "-"}</p>
        <p><strong>Conclusão:</strong> {analysis.conclusion || "-"}</p>
      </div>

      {/* Comparações */}
      <h2 className="text-xl font-semibold mb-2">Comparações</h2>
      {!comparisons || comparisons.length === 0 ? (
        <EmptyState
          title="Nenhuma comparação encontrada"
          description="Ainda não existem comparações cadastradas para esta análise."
          actionLabel="Criar comparação"
          onAction={() => console.log("Abrir criação de comparação")}
        />
      ) : (
        <DataTable
          data={comparisons?.map(c => ({ ...c, similarity_score: c.similarity_score ?? undefined })) ?? []}
          columns={columns}
        />
      )}

      <Link to={`/analyses/${analysisId}/comparisons/create`} className="btn btn-primary mt-3">
        Criar Comparação
      </Link>
    </div>
  );
};
