// src/pages/analyses/AnalysesList.tsx
import { useParams, Link } from "react-router-dom";
import { useAnalysesByCase } from "@/api/hooks/useAnalyses";
import EmptyState from "@/components/common/EmptyState"; // default export
import { DataTable } from "@/components/common/DataTable"; // valor
import type { Column } from "@/components/common/DataTable"; // tipo
import type { Analysis } from "@/api/schemas"; // tipo

export const AnalysesList = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { data: analyses, isLoading, error } = useAnalysesByCase(Number(caseId));

  if (isLoading) return <p>Carregando análises...</p>;
  if (error) return <p>Erro ao carregar análises</p>;

  if (!analyses || analyses.length === 0) {
    return (
      <EmptyState
        title="Nenhuma análise encontrada"
        description="Ainda não existem análises cadastradas para este caso."
        actionLabel="Criar nova análise"
        onAction={() => console.log("Abrir modal de nova análise")}
      />
    );
  }

  const columns: Column<Analysis>[] = [
    { key: "id", label: "ID" },
    { key: "title", label: "Título" },
    {
      key: "created_at",
      label: "Criado em",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      // 'actions' é uma coluna especial só para UI
      key: "actions" as const,
      label: "Ações",
      render: (_value, row) => <Link to={`/analyses/${row.id}`}>Detalhes</Link>,
    },
  ];

  return (
    <div>
      <h1 className="mb-4">Análises do Caso #{caseId}</h1>
      <DataTable data={analyses} columns={columns} />

      <Link to={`/cases/${caseId}/analyses/create`} className="btn btn-primary mt-3">
        Criar Nova Análise
      </Link>
    </div>
  );
};
