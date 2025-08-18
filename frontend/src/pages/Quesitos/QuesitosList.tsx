// src/pages/quesitos/QuesitosList.tsx
import { useParams } from "react-router-dom";
import { useQuesitosByCase, useUpdateQuesito } from "@/api/hooks/useQuesitos";
import { useState } from "react";
import EmptyState from "@/components/common/EmptyState";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import type { Quesito } from "@/api/schemas";

export const QuesitosList = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { data: quesitos, isLoading, error } = useQuesitosByCase(Number(caseId));
  const updateMutation = useUpdateQuesito();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");

  if (isLoading) return <p>Carregando quesitos...</p>;
  if (error) return <p>Erro ao carregar quesitos</p>;

  if (!quesitos || quesitos.length === 0) {
    return (
      <EmptyState
        title="Nenhum quesito encontrado"
        description="Este caso ainda não possui quesitos cadastrados."
      />
    );
  }

  const handleSave = (id: number) => {
    updateMutation.mutate({ id, payload: { answer } });
    setEditingId(null);
  };

  const columns: Column<Quesito>[] = [
    { key: "id", label: "ID" },
    { key: "question", label: "Pergunta" },
    {
      key: "answer",
      label: "Resposta",
      render: (_value, row) =>
        editingId === row.id ? (
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="form-control"
          />
        ) : (
          row.answer || "-"
        ),
    },
    {
      key: "actions" as const,
      label: "Ações",
      render: (_value, row) =>
        editingId === row.id ? (
          <button className="btn btn-success btn-sm" onClick={() => handleSave(row.id)}>
            Salvar
          </button>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setEditingId(row.id);
              setAnswer(row.answer || "");
            }}
          >
            Responder
          </button>
        ),
    },
  ];

  return (
    <div>
      <h1>Quesitos do Caso #{caseId}</h1>
      <DataTable data={quesitos} columns={columns} />
    </div>
  );
};
