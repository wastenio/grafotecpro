// src/pages/quesitos/QuesitoCreate.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateQuesito } from "@/api/hooks/useQuesitos";

export const QuesitoCreate = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");

  const createQuesito = useCreateQuesito(Number(caseId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;

    // Passando case_id no payload, conforme esperado
    createQuesito.mutate(
      { case_id: Number(caseId), question },
      {
        onSuccess: () => navigate(`/cases/${caseId}`),
      }
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Novo Quesito</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <label className="flex flex-col">
          Pergunta:
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border rounded p-2 mt-1"
          />
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={createQuesito.status === "pending"}
        >
          {createQuesito.status === "pending" ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
};
