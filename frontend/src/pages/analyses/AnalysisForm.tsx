import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAnalysis, Analysis as AnalysisType } from "../../api/hooks/useAnalyses";

const AnalysisForm = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ observation: "", methodology: "", conclusion: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (formData: any) => {
    if (!caseId) return; // garante que caseId existe

    setIsSubmitting(true);
    try {
      const newAnalysis: AnalysisType = await createAnalysis({
        case: Number(caseId),
        ...formData,
      });

      navigate(`/analyses/${newAnalysis.id}`);
    } catch (err) {
      console.error("Erro ao criar análise:", err);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Criar Nova Análise</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea name="observation" placeholder="Observação" value={formData.observation} onChange={handleChange} required className="border p-2 rounded" />
        <textarea name="methodology" placeholder="Metodologia" value={formData.methodology} onChange={handleChange} required className="border p-2 rounded" />
        <textarea name="conclusion" placeholder="Conclusão" value={formData.conclusion} onChange={handleChange} className="border p-2 rounded" />
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          {isSubmitting ? "Salvando..." : "Criar Análise"}
        </button>
      </form>
    </div>
  );
};

export default AnalysisForm;
