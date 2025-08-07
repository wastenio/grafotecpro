import ImageViewer from "../components/ImageViewer";
import { useParams } from "react-router-dom";

export default function ViewDocument() {
  const { documentId } = useParams();

  // Mock da imagem (depois vamos buscar pela API)
  const imageUrl = `http://localhost:8000/media/documents/${documentId}.jpg`; // ajuste conforme seu backend

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Visualizar Documento</h2>
      <ImageViewer imageUrl={imageUrl} />
    </div>
  );
}
