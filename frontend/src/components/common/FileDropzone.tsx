import React, { useCallback } from "react";
import { useDropzone, type Accept } from "react-dropzone";

interface FileDropzoneProps {
  onFileUpload: (files: File[]) => void;
  accept?: string; // ex: ".pdf,.docx"
  multiple?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileUpload,
  accept,
  multiple = false,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileUpload(acceptedFiles);
    },
    [onFileUpload]
  );

  // Converte string ".pdf,.docx" em formato Accept do react-dropzone
  const acceptObj: Accept | undefined = accept
    ? accept.split(",").reduce((acc, ext) => {
        const mimeType = ext.trim(); // aqui podemos melhorar para mapear MIME reais se precisar
        acc[mimeType] = [];
        return acc;
      }, {} as Accept)
    : undefined;

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
      {isDragActive ? (
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
