import ImageViewer from '../components/ImageViewer';
import { useParams } from 'react-router-dom';

export default function ViewDocument() {
  const { documentId } = useParams();

  const imageUrl = `http://localhost:8000/media/documents/${documentId}.jpg`; // ajuste conforme sua estrutura

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Visualizar Documento</h2>
      {documentId ? <ImageViewer imageUrl={imageUrl} documentId={Number(documentId)} /> : <p>ID do documento inválido.</p>}
    </div>
  );
}
