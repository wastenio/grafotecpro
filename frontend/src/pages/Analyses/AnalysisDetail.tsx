// src/pages/analyses/AnalysisDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useAnalysis } from "@/api/hooks/useAnalyses";
import { useComparisonsByAnalysis } from "@/api/hooks/useComparisons";
import EmptyState from "@/components/common/EmptyState";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import type { Comparison } from "@/api/schemas";

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
      render: (_value, row) => <Link to={`/comparisons/${row.id}`}>Detalhes</Link>,
    },
  ];

  return (
    <div>
      <h1>{analysis.title}</h1>
      <p>Metodologia: {analysis.methodology || "-"}</p>
      <p>Conclusão: {analysis.conclusion || "-"}</p>

      <h2 className="mt-4">Comparações</h2>
      {!comparisons || comparisons.length === 0 ? (
        <EmptyState
          title="Nenhuma comparação encontrada"
          description="Ainda não existem comparações cadastradas para esta análise."
          actionLabel="Criar comparação"
          onAction={() => console.log("Abrir criação de comparação")}
        />
      ) : (
        <DataTable data={comparisons} columns={columns} />
      )}

      <Link to={`/analyses/${analysisId}/comparisons/create`} className="btn btn-primary mt-3">
        Criar Comparação
      </Link>
    </div>
  );
};
