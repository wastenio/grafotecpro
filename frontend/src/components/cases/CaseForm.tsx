// src/pages/cases/CaseForm.tsx
import React, { useState } from "react";
import { createCase } from "../../api/cases";
import Loader from "../../components/common/Loader";

interface CaseFormProps {
  onCaseCreated: (newCase: any) => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ onCaseCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const newCase = await createCase({ title, description });
      setTitle("");
      setDescription("");
      onCaseCreated(newCase);
    } catch (err: any) {
      console.error("Erro ao criar case:", err.response || err);
      setError("Não foi possível criar o caso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">Criar Novo Caso</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descrição:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? <Loader /> : "Criar Caso"}
        </button>
      </form>
    </div>
  );
};

export default CaseForm;
