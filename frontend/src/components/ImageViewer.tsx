import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { PictureAnnotation, IAnnotation } from '@w95boy/react-picture-annotation';
import api from '../api/api';

interface ImageViewerProps {
  imageUrl: string;
  documentId: number;  // precisa receber o ID do documento para salvar
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, documentId }) => {
  const [annotations, setAnnotations] = useState<IAnnotation[]>([]);

  // Carregar anotações do backend ao montar
  useEffect(() => {
    const fetchAnnotations = async () => {
      try {
        const res = await api.get(`/documents/${documentId}/`);
        if (res.data.annotations) {
          setAnnotations(res.data.annotations);
        }
      } catch (err) {
        console.error('Erro ao buscar anotações', err);
      }
    };
    fetchAnnotations();
  }, [documentId]);

  // Enviar anotações ao backend ao modificar
  const handleAnnotationsChange = async (newAnnotations: IAnnotation[]) => {
    setAnnotations(newAnnotations);
    try {
      await api.patch(`/documents/${documentId}/annotations/`, { annotations: newAnnotations });
    } catch (err) {
      console.error('Erro ao salvar anotações', err);
    }
  };

  return (
    <div className="w-full h-[600px] border rounded shadow relative bg-white">
      <TransformWrapper>
        <TransformComponent>
          <PictureAnnotation
            image={imageUrl}
            width={800}
            height={600}
            onChange={handleAnnotationsChange}
            annotationData={annotations}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default ImageViewer;
