// src/pages/comparisons/ComparisonCreate.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCreateComparison } from "@/api/hooks/useComparisons";

export const ComparisonCreate = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [result, setResult] = useState("");

  // Passa o analysisId obrigatoriamente
  const mutation = useCreateComparison(Number(analysisId));

  const isPending = mutation.status === "pending";
  const isError = mutation.status === "error";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({
        similarity_score: similarityScore,
        result,
      });
      navigate(`/analyses/${analysisId}`);
    } catch (err) {
      console.error("Erro ao criar comparação:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nova Comparação</h1>
      {isError && <p className="text-red-600 mb-2">Erro ao criar comparação</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Pontuação de Similaridade</label>
          <input
            type="number"
            value={similarityScore ?? ""}
            onChange={(e) => setSimilarityScore(Number(e.target.value))}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Resultado</label>
          <textarea
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isPending ? "Criando..." : "Criar Comparação"}
        </button>
      </form>
    </div>
  );
};
