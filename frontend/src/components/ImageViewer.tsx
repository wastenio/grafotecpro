import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { PictureAnnotation, IAnnotation } from '@w95boy/react-picture-annotation';

interface ImageViewerProps {
  imageUrl: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl }) => {
  const [annotations, setAnnotations] = useState<IAnnotation[]>([]);

  return (
    <div className="w-full h-[600px] border rounded shadow relative bg-white">
      <TransformWrapper>
        <TransformComponent>
          <PictureAnnotation
            image={imageUrl}
            width={800}
            height={600}
            onChange={(newAnnotations: IAnnotation[]) => setAnnotations(newAnnotations)}
            annotationData={annotations}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default ImageViewer;
