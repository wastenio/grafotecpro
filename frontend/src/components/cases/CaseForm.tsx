// src/pages/cases/CaseForm.tsx

import React, { useState } from "react";
import { createCase } from "../../api/cases";

// Tipagem do props do CaseForm
interface CaseFormProps {
  onCaseCreated: (newCase: any) => void; // agora aceita o case criado
}

const CaseForm: React.FC<CaseFormProps> = ({ onCaseCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const newCase = await createCase({ title, description });
    setTitle("");
    setDescription("");
    onCaseCreated(newCase); // passa o case criado
  } catch (err: any) {
    console.error("Erro ao criar case:", err.response || err);
    setError("Não foi possível criar o caso.");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar Novo Caso</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Título:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descrição:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Criando..." : "Criar Caso"}
      </button>
    </form>
  );
};

export default CaseForm;
