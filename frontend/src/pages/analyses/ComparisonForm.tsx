import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComparison } from "../../api/hooks/comparisons";

const ComparisonForm = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ pattern_id?: number; document_id?: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisId) return;
    setIsSubmitting(true);
    try {
      const newComparison = await createComparison(Number(analysisId), formData);
      navigate(`/comparisons/${newComparison.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Criar Nova Comparação</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="number" name="pattern_id" placeholder="Pattern ID" value={formData.pattern_id || ""} onChange={handleChange} required className="border p-2 rounded" />
        <input type="number" name="document_id" placeholder="Document ID" value={formData.document_id || ""} onChange={handleChange} required className="border p-2 rounded" />
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          {isSubmitting ? "Salvando..." : "Criar Comparação"}
        </button>
      </form>
    </div>
  );
};

export default ComparisonForm;
