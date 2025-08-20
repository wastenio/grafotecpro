import { useState } from "react";
import { createAnalysis } from "../../api/hooks/useAnalyses";
import { useNavigate, useParams } from "react-router-dom";

const AnalysisForm = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;

    try {
      await createAnalysis({ title, description, case: Number(caseId) });
      navigate(`/cases/${caseId}/analyses`);
    } catch (error) {
      console.error("Erro ao criar análise:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar Nova Análise</h2>
      <div>
        <label>Título:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Descrição:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <button type="submit">Salvar</button>
    </form>
  );
};

export default AnalysisForm;
