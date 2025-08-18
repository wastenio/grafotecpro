// src/components/analysis/ComparisonCard.tsx
import React from "react";
import type { Comparison } from "@/api/schemas";
import { format } from "date-fns";

interface ComparisonCardProps {
  comparison: Comparison;
  onView?: (comparisonId: number) => void;
  onDelete?: (comparisonId: number) => void;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({
  comparison,
  onView,
  onDelete,
}) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">
            Criado em: {comparison.created_at ? format(new Date(comparison.created_at), "dd/MM/yyyy HH:mm") : "-"}
          </p>
          <h3 className="text-lg font-semibold mt-1">{comparison.result || "Sem resultado"}</h3>
          {comparison.similarity_score !== null && (
            <p className="text-sm text-gray-700 mt-1">
              Similaridade: {comparison.similarity_score.toFixed(2)}%
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {onView && (
            <button
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => onView(comparison.id)}
            >
              Visualizar
            </button>
          )}
          {onDelete && (
            <button
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => onDelete(comparison.id)}
            >
              Deletar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;
