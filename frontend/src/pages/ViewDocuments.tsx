import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

interface Document {
  id: number;
  file: string;
  uploaded_at: string;
}

export default function ViewDocuments() {
  const { caseId } = useParams();
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get(`/cases/${caseId}/documents/`);
        setDocuments(res.data);
      } catch (error) {
        alert('Erro ao buscar documentos.');
      }
    };
    fetchDocs();
  }, [caseId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Documentos do Caso #{caseId}</h2>
      <ul className="space-y-3">
        {documents.map((doc) => (
          <li key={doc.id} className="bg-gray-100 p-3 rounded flex justify-between items-center">
            <a href={doc.file} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
              📄 Documento #{doc.id}
            </a>
            <span className="text-sm text-gray-500">{new Date(doc.uploaded_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
