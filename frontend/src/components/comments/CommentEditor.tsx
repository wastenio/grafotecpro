// src/components/comments/CommentEditor.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useComments, useCreateComment } from "@/api/hooks/useComments";
import type { Comment } from "@/api/schemas";

export const CommentEditor = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const numericCaseId = Number(caseId);

  // Garante que só chama hooks se caseId estiver definido
  const { data: comments = [] } = useComments(numericCaseId);
  const createComment = useCreateComment(numericCaseId);

  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      // Chama mutateAsync com apenas um argumento: { content }
      await createComment.mutateAsync({ content });
      setContent(""); // limpa input
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white">
      <h2 className="text-lg font-medium mb-2">Comentários</h2>

      {/* Lista de comentários */}
      <ul className="mb-4 space-y-2">
        {comments.length === 0 && (
          <li className="text-gray-500">Nenhum comentário ainda.</li>
        )}
        {comments.map((c: Comment) => (
          <li key={c.id} className="p-2 border rounded bg-gray-50">
            {c.content}
          </li>
        ))}
      </ul>

      {/* Editor de comentário */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Escreva seu comentário..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <button
          type="submit"
          disabled={createComment.status === "pending"}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {createComment.status === "pending" ? "Salvando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};
