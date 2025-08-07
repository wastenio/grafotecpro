import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function UploadDocument() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Selecione um arquivo.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('case', caseId || '');

    try {
      await api.post(`/documents/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Documento enviado com sucesso!');
      navigate(`/cases/${caseId}/documents`);
    } catch (error) {
      alert('Erro ao enviar documento.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Enviar Documento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" onChange={handleFileChange} className="w-full" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Enviar
        </button>
      </form>
    </div>
  );
}
