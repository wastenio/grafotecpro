// src/pages/analyses/AnalysisCreate.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCreateAnalysis } from "@/api/hooks/useAnalyses";

export const AnalysisCreate = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [methodology, setMethodology] = useState("");
  const [conclusion, setConclusion] = useState("");

  if (!caseId) return <p>Case ID não fornecido.</p>;

  // Passando caseId corretamente para o hook
  const mutation = useCreateAnalysis(Number(caseId));

  const isLoading = mutation.status === "pending";
  const isError = mutation.status === "error";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ title, methodology, conclusion });
      navigate(`/cases/${caseId}`);
    } catch (error) {
      console.error("Erro ao criar análise:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nova Análise</h1>
      {isError && <p className="text-red-600 mb-2">Erro ao criar análise</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Metodologia</label>
          <textarea
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Conclusão</label>
          <textarea
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isLoading ? "Criando..." : "Criar Análise"}
        </button>
      </form>
    </div>
  );
};
