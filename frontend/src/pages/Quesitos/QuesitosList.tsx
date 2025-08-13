// src/pages/quesitos/QuesitosList.tsx
import { useParams } from "react-router-dom";
import { useQuesitosByCase, useUpdateQuesito } from "../../api/hooks/useQuesitos";
import { useState } from "react";
import { EmptyState } from "../../components/common/EmptyState";

export const QuesitosList = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { data: quesitos, isLoading, error } = useQuesitosByCase(Number(caseId));
  const updateMutation = useUpdateQuesito();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");

  if (isLoading) return <p>Carregando quesitos...</p>;
  if (error) return <p>Erro ao carregar quesitos</p>;

  if (!quesitos || quesitos.length === 0) return <EmptyState message="Nenhum quesito encontrado" />;

  const handleSave = (id: number) => {
    updateMutation.mutate({ id, payload: { answer } });
    setEditingId(null);
  };

  return (
    <div>
      <h1>Quesitos do Caso #{caseId}</h1>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Pergunta</th>
            <th>Resposta</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {quesitos.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{q.question}</td>
              <td>
                {editingId === q.id ? (
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  q.answer || "-"
                )}
              </td>
              <td>
                {editingId === q.id ? (
                  <button className="btn btn-success btn-sm" onClick={() => handleSave(q.id)}>
                    Salvar
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setEditingId(q.id);
                      setAnswer(q.answer || "");
                    }}
                  >
                    Responder
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
