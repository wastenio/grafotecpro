import { useParams, Link } from "react-router-dom";
import { useAnalysesByCase } from "@/api/hooks/useAnalyses";
import EmptyState from "@/components/common/EmptyState";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import type { Analysis } from "@/api/types";

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
      key: "case_status",
      label: "Status do Caso",
      render: (_value, row) => row.case?.status ?? "Não definido",
    },
    {
      key: "case_perito",
      label: "Perito",
      render: (_value, row) =>
        row.case?.perito ? `${row.case.perito.first_name} ${row.case.perito.last_name}` : "Não atribuído",
    },
    {
      key: "case_fraudType",
      label: "Tipo de Fraude",
      render: (_value, row) => row.case?.fraudType?.name ?? "Não definido",
    },
    {
      key: "created_at",
      label: "Criado em",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "actions" as const,
      label: "Ações",
      render: (_value, row) => <Link to={`/analyses/${row.id}`} className="text-blue-600 hover:underline">Detalhes</Link>,
    },
  ];

  return (
    <div>
      <h1 className="mb-4">Análises do Caso #{caseId}</h1>
      <DataTable data={analyses ?? []} columns={columns} />

      <Link to={`/cases/${caseId}/analyses/create`} className="btn btn-primary mt-3">
        Criar Nova Análise
      </Link>
    </div>
  );
};
