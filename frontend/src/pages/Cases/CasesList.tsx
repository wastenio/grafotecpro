import { Link } from "react-router-dom";
import { useCases } from "../../api/hooks/useCases";
import EmptyState from "@/components/common/EmptyState";
import { DataTable, type Column } from "@/components/common/DataTable";
import type { Case } from "@/api/types";

export const CasesList = () => {
  const { data: cases, isLoading, error } = useCases();

  if (isLoading) return <p>Carregando casos...</p>;
  if (error) return <p>Erro ao carregar casos</p>;

  if (!cases || cases.length === 0) {
    return (
      <EmptyState
        title="Nenhum caso encontrado"
        description="Você ainda não possui casos cadastrados."
        actionLabel="Criar novo caso"
        onAction={() => console.log("Abrir modal de novo caso")}
      />
    );
  }

  const columns: Column<Case>[] = [
    { key: "id", label: "ID" },
    { key: "title", label: "Título" },
    {
      key: "status",
      label: "Status",
      render: (row) => row.status ?? "Não definido",
    },
    {
      key: "perito",
      label: "Perito",
      render: (_value, row) =>
        row.perito ? `${row.perito.first_name} ${row.perito.last_name}` : "Não atribuído",
    },
    {
      key: "fraudType",
      label: "Tipo de Fraude",
      render: (_value, row) => row.fraudType?.name ?? "Não definido",
    },
    {
      key: "created_at",
      label: "Criado em",
      render: (_value, row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "id",
      label: "Ações",
      render: (_value, row) => <Link to={`/cases/${row.id}`} className="text-blue-600 hover:underline">Detalhes</Link>,
    },
  ];

  return (
    <div>
      <h1>Casos</h1>
      <DataTable columns={columns} data={cases ?? []} />
      <Link to="/cases/create" className="btn btn-primary mt-3">
        Criar Novo Caso
      </Link>
    </div>
  );
};
