// src/pages/quesitos/QuesitoCreate.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateQuesito } from "@/api/hooks/useQuesitos";

export const QuesitoCreate = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");

  // Checa se o caseId existe
  if (!caseId) return <p>Case ID não fornecido.</p>;

  // Mutation exige o caseId como argumento
  const createQuesito = useCreateQuesito(Number(caseId));

  const isPending = createQuesito.status === "pending";
  const isError = createQuesito.status === "error";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;

    try {
      await createQuesito.mutateAsync({ case_id: Number(caseId), question });
      navigate(`/cases/${caseId}`);
    } catch (err) {
      console.error("Erro ao criar quesito:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Novo Quesito</h1>
      {isError && <p className="text-red-600 mb-2">Erro ao criar quesito</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <label className="flex flex-col">
          Pergunta:
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border rounded p-2 mt-1"
            required
          />
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isPending}
        >
          {isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
};
