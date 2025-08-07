import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

interface Analysis {
  id: number;
  document_original: number;
  document_contested: number;
  observation: string;
  created_at: string;
}

export default function AnalysisList() {
  const { caseId } = useParams();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await api.get(`/cases/${caseId}/analysis/list/`);
        setAnalyses(response.data);
      } catch (err) {
        alert('Erro ao carregar análises');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [caseId]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Análises do Caso #{caseId}</h1>

      <Link
        to={`/cases/${caseId}/compare`}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Nova Análise
      </Link>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p>Carregando análises...</p>
        ) : analyses.length === 0 ? (
          <p>Nenhuma análise realizada até o momento.</p>
        ) : (
          analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="border p-4 rounded shadow bg-white space-y-2"
            >
              <div className="text-sm text-gray-500">
                Criada em: {new Date(analysis.created_at).toLocaleString()}
              </div>
              <div className="text-sm text-gray-700">
                Documento Original: #{analysis.document_original} | Contestada: #{analysis.document_contested}
              </div>
              <div className="whitespace-pre-wrap">
                <strong>Observação:</strong><br />{analysis.observation}
              </div>
              {/* No futuro: botões para editar/excluir */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
