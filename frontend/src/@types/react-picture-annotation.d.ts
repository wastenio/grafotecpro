declare module '@w95boy/react-picture-annotation' {
  import * as React from 'react';

  export interface IAnnotation {
    id?: string;
    mark: {
      type: string;
      geometry: any;
    };
    data?: any;
  }

  export interface PictureAnnotationProps {
    image: string;
    width: number;
    height: number;
    annotationData: IAnnotation[];
    onChange: (annotations: IAnnotation[]) => void;
  }

  export class PictureAnnotation extends React.Component<PictureAnnotationProps> {}
}
