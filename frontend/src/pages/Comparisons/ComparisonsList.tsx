// src/pages/comparisons/ComparisonsList.tsx
import { useParams, Link } from "react-router-dom";
import { useComparisonsByAnalysis } from "@/api/hooks/useComparisons";
import EmptyState from "@/components/common/EmptyState";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import type { Comparison } from "@/api/schemas";

export const ComparisonsList = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const { data: comparisons, isLoading, error } = useComparisonsByAnalysis(Number(analysisId));

  if (isLoading) return <p>Carregando comparações...</p>;
  if (error) return <p>Erro ao carregar comparações</p>;

  if (!comparisons || comparisons.length === 0) {
    return (
      <EmptyState
        title="Nenhuma comparação encontrada"
        description="Ainda não foram cadastradas comparações para esta análise."
      />
    );
  }

  const columns: Column<Comparison>[] = [
    { key: "id", label: "ID" },
    { key: "similarity_score", label: "Similaridade" },
    { key: "result", label: "Resultado" },
    {
      key: "actions" as const,
      label: "Ações",
      render: (_value, row) => (
        <Link to={`/comparisons/${row.id}`} className="btn btn-link btn-sm">
          Detalhes
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h1>Comparações da Análise #{analysisId}</h1>
      <DataTable data={comparisons} columns={columns} />
      <Link to={`/analyses/${analysisId}/comparisons/create`} className="btn btn-primary mt-3">
        Criar Comparação
      </Link>
    </div>
  );
};
