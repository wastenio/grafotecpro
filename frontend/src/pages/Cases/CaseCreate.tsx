import { useNavigate } from "react-router-dom";
import { useCreateCase } from "@/api/hooks/useCases";
import { useState } from "react";

export const CaseCreate = () => {
  const navigate = useNavigate();
  const { mutateAsync: createCase } = useCreateCase();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCase({ title, description });
    navigate("/cases");
  };

  return (
    <div className="p-4">
      <h1>Criar Novo Caso</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
          Criar Caso
        </button>
      </form>
    </div>
  );
};
