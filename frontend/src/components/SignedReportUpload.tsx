import { useState } from 'react';
import api from '../services/api';

const SignedReportUpload = ({ caseId }: { caseId: number }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('final_report', file);

    try {
      await api.post(`/cases/${caseId}/upload-signed-report/`, formData);
      alert('Laudo assinado enviado com sucesso.');
    } catch (error) {
      alert('Erro ao enviar o laudo.');
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Upload do Laudo Assinado</h2>
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-3 py-1 mt-2 rounded hover:bg-blue-700">
        Enviar PDF
      </button>
    </div>
  );
};

export default SignedReportUpload;
