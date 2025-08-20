import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createComparison } from "../../api/hooks/comparisons";

const ComparisonForm = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisId) return;

    try {
      await createComparison(Number(analysisId), { title, description });
      navigate(`/analysis/${analysisId}/comparisons`);
    } catch (error) {
      console.error("Erro ao criar comparação:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar Nova Comparação</h2>
      <input
        type="text"
        value={title}
        placeholder="Título"
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        value={description}
        placeholder="Descrição"
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Salvar</button>
    </form>
  );
};

export default ComparisonForm;
