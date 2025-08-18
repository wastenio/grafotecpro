// src/pages/cases/CasesList.tsx
import { Link } from "react-router-dom";
import { useCases } from "../../api/hooks/useCases";
import EmptyState from "@/components/common/EmptyState";
import { DataTable, type Column } from "@/components/common/DataTable";
import type { Case } from "@/api/schemas";

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
      key: "created_at",
      label: "Criado em",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "id",
      label: "Ações",
      render: (_: any, row: Case) => <Link to={`/cases/${row.id}`}>Detalhes</Link>,
    },
  ];


  return (
    <div>
      <h1>Casos</h1>
      <DataTable columns={columns} data={cases} />
      <Link to="/cases/create" className="btn btn-primary mt-3">
        Criar Novo Caso
      </Link>
    </div>
  );
};
