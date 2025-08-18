// src/pages/documents/DocumentVersions.tsx
import { useParams } from "react-router-dom";
import {
  useDocumentVersions,
  useUploadDocumentVersion,
  useDownloadDocumentVersion,
} from "../../api/hooks/useDocuments";
import { useState } from "react";
import EmptyState from "../../components/common/EmptyState";

export const DocumentVersions = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const { data: versions, isLoading, error } = useDocumentVersions(Number(documentId));
  const uploadMutation = useUploadDocumentVersion(Number(documentId));
  const downloadFn = useDownloadDocumentVersion();

  const [file, setFile] = useState<File | null>(null);
  const [changelog, setChangelog] = useState("");

  const handleUpload = () => {
    if (file) {
      uploadMutation.mutate({ file, changelog });
      setFile(null);
      setChangelog("");
    }
  };

  if (isLoading) return <p>Carregando versões...</p>;
  if (error) return <p>Erro ao carregar versões</p>;

  if (!versions || versions.length === 0)
    return (
      <EmptyState
        title="Nenhuma versão encontrada"
        description="Este documento ainda não possui versões cadastradas."
        actionLabel="Adicionar versão"
        onAction={() => console.log("Abrir modal de upload")}
      />
    );

  return (
    <div>
      <h1>Versões do Documento #{documentId}</h1>

      <div className="mb-3">
        <input type="file" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
        <input
          type="text"
          placeholder="Changelog"
          value={changelog}
          onChange={(e) => setChangelog(e.target.value)}
          className="form-control mt-1"
        />
        <button className="btn btn-primary mt-2" onClick={handleUpload}>
          Upload
        </button>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Versão</th>
            <th>Changelog</th>
            <th>Criado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.version_number}</td>
              <td>{v.changelog ?? "-"}</td>
              <td>{new Date(v.created_at).toLocaleString()}</td>
              <td>
                <button className="btn btn-secondary btn-sm" onClick={() => downloadFn(v.id)}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
