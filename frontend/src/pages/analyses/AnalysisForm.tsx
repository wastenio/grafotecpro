import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAnalysis, Analysis as AnalysisType } from "../../api/hooks/useAnalyses";

interface AnalysisFormData {
  observation: string;
  methodology: string;
  conclusion: string;
}

const AnalysisForm = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AnalysisFormData>({
    observation: "",
    methodology: "",
    conclusion: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;

    setIsSubmitting(true);
    try {
      // Adaptando para o backend: enviando case_id e os campos da análise
      const payload = {
        case_id: Number(caseId),
        ...formData,
      };
      const newAnalysis: AnalysisType = await createAnalysis(payload);
      navigate(`/analyses/${newAnalysis.id}`);
    } catch (error) {
      console.error("Erro ao criar análise:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Criar Nova Análise</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Observação:</label>
          <textarea
            name="observation"
            value={formData.observation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Metodologia:</label>
          <textarea
            name="methodology"
            value={formData.methodology}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Conclusão:</label>
          <textarea
            name="conclusion"
            value={formData.conclusion}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Criar Análise"}
        </button>
      </form>
    </div>
  );
};

export default AnalysisForm;
