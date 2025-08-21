import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComparison } from "../../api/hooks/comparisons";

interface ComparisonFormData {
  pattern_id?: number;
  document_id?: number;
  text?: string; // caso queira algum campo adicional
}

const ComparisonForm = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ComparisonFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) || value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisId) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
      };
      const newComparison = await createComparison(Number(analysisId), payload);
      navigate(`/comparisons/${newComparison.id}`);
    } catch (error) {
      console.error("Erro ao criar comparação:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Criar Nova Comparação</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pattern ID:</label>
          <input
            type="number"
            name="pattern_id"
            value={formData.pattern_id || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Document ID:</label>
          <input
            type="number"
            name="document_id"
            value={formData.document_id || ""}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Criar Comparação"}
        </button>
      </form>
    </div>
  );
};

export default ComparisonForm;
