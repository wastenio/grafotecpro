// src/components/analysis/ComparisonsList.tsx
import React from "react";
import { useComparisonsByAnalysis, useDeleteComparison } from "@/api/hooks/useComparisons";
import ComparisonCard from "./ComparisonCard";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ComparisonsListProps {
  analysisId: number;
}

const ComparisonsList: React.FC<ComparisonsListProps> = ({ analysisId }) => {
  const { data: comparisons = [], isLoading, isError } = useComparisonsByAnalysis(analysisId);
  const deleteMutation = useDeleteComparison(analysisId);
  const navigate = useNavigate();

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleView = (comparisonId: number) => {
    navigate(`/comparisons/${comparisonId}`);
  };

  const handleDelete = (comparisonId: number) => {
    setDeleteTargetId(comparisonId);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId === null) return;
    try {
      await deleteMutation.mutateAsync(deleteTargetId);
    } catch (err) {
      console.error("Erro ao deletar comparação:", err);
    } finally {
      setIsDialogOpen(false);
      setDeleteTargetId(null);
    }
  };

  if (isLoading) return <p>Carregando comparações...</p>;
  if (isError) return <p>Erro ao carregar comparações.</p>;

  if (comparisons.length === 0) return <p>Nenhuma comparação cadastrada ainda.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
      {comparisons.map((c) => (
        <ComparisonCard
          key={c.id}
          comparison={c}
          onView={handleView}
          onDelete={handleDelete}
        />
      ))}

      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Excluir Comparação"
        description="Tem certeza que deseja deletar esta comparação?"
        confirmLabel="Deletar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default ComparisonsList;
