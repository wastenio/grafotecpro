import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

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

    const downloadReport = async () => {
        try {
            const response = await api.get(`/cases/${caseId}/report/`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `laudo_caso_${caseId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Erro ao gerar o PDF do laudo.');
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Análises do Caso #{caseId}</h1>

            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
                <Link
                    to={`/cases/${caseId}/compare`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                >
                    Nova Análise
                </Link>

                <button
                    onClick={downloadReport}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
                >
                    Gerar Laudo em PDF
                </button>
            </div>

            <div className="space-y-4">
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
                            <button
                                onClick={() => navigate(`/analysis/${analysis.id}/edit`)}
                                className="text-blue-600 hover:underline mr-4"
                            >
                                Editar
                            </button>

                            <button
                                onClick={async () => {
                                    const confirm = window.confirm('Tem certeza que deseja excluir esta análise?');
                                    if (confirm) {
                                        try {
                                            await api.delete(`/analysis/${analysis.id}/delete/`);
                                            alert('Análise excluída!');
                                            window.location.reload(); // ou atualize estado via useState
                                        } catch (err) {
                                            alert('Erro ao excluir');
                                        }
                                    }
                                }}
                                className="text-red-600 hover:underline"
                            >
                                Excluir
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
