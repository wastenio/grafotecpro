import React, { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { useDropzone, type Accept } from "react-dropzone";


interface FileDropzoneProps {
  onFileUpload: (files: File[]) => void;
  accept?: string; // ex: ".pdf,.docx"
  multiple?: boolean;
  children?: ReactNode;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileUpload,
  accept,
  multiple = false,
  children,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileUpload(acceptedFiles);
    },
    [onFileUpload]
  );

  const acceptObj: Accept | undefined = useMemo(() => {
    if (!accept) return undefined;
    return accept.split(",").reduce((acc, ext) => {
      const trimmed = ext.trim();
      acc[trimmed] = [];
      return acc;
    }, {} as Accept);
  }, [accept]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptObj,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded p-6 text-center transition-colors
        ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"}`}
    >
      <input {...getInputProps()} />
      {children ? (
        children
      ) : isDragActive ? (
        <p className="text-blue-600">Solte os arquivos aqui...</p>
      ) : (
        <p>
          Arraste e solte arquivos aqui, ou clique para selecionar <br />
          {accept && <span className="text-sm text-gray-500">Tipos aceitos: {accept}</span>}
        </p>
      )}
    </div>
  );
};

export default FileDropzone;
