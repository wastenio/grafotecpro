import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function EditAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/analysis/${id}/edit/`);
        setObservation(response.data.observation);
      } catch (err) {
        alert('Erro ao carregar análise');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/analysis/${id}/edit/`, { observation });
      alert('Análise atualizada com sucesso!');
      navigate(-1);
    } catch (err) {
      alert('Erro ao atualizar análise');
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Análise</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          className="w-full h-40 border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
