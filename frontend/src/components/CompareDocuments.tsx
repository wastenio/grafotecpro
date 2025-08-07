import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageViewer from '../components/ImageViewer';
import api from '../api/api';

export default function CompareDocuments() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  // IDs dos documentos a comparar (pode vir pela query ou manual)
  const [doc1, setDoc1] = useState<string>('');
  const [doc2, setDoc2] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Pode puxar do backend uma lista de documentos do caso para preencher as opções
    // Por enquanto, placeholder vazio
  }, [caseId]);

  const handleSave = async () => {
    if (!doc1 || !doc2) return alert('Selecione os dois documentos para comparar.');

    setSaving(true);
    try {
      await api.post(`/cases/${caseId}/analysis/`, {
        document_original: doc1,
        document_contested: doc2,
        observation,
      });
      alert('Análise salva com sucesso!');
      navigate(`/cases/${caseId}/dashboard`);
    } catch {
      alert('Erro ao salvar análise.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">Comparar Documentos - Caso #{caseId}</h2>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-2 font-semibold">Documento Original</label>
          <input type="text" placeholder="ID documento original" value={doc1} onChange={e => setDoc1(e.target.value)} className="border p-2 rounded w-full" />
          {doc1 && <ImageViewer imageUrl={`http://localhost:8000/media/documents/${doc1}.jpg`} documentId={0} />}
        </div>

        <div className="flex-1">
          <label className="block mb-2 font-semibold">Documento Contestada</label>
          <input type="text" placeholder="ID documento contestado" value={doc2} onChange={e => setDoc2(e.target.value)} className="border p-2 rounded w-full" />
          {doc2 && <ImageViewer imageUrl={`http://localhost:8000/media/documents/${doc2}.jpg`} documentId={0} />}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold">Observação da Análise</label>
        <textarea
          rows={6}
          className="w-full border p-2 rounded"
          value={observation}
          onChange={e => setObservation(e.target.value)}
          placeholder="Digite sua análise detalhada aqui..."
        />
      </div>

      <button
        disabled={saving}
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {saving ? 'Salvando...' : 'Salvar Análise'}
      </button>
    </div>
  );
}
