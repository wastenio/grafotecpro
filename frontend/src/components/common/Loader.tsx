// src/components/common/Loader.tsx
import React from "react";

interface LoaderProps {
  message?: string;       // Mensagem customizável
  fullHeight?: boolean;   // Ocupa toda a altura disponível
}

const Loader: React.FC<LoaderProps> = ({
  message = "Carregando...",
  fullHeight = false,
}) => {
  return (
    <div
      className={`flex justify-center items-center ${
        fullHeight ? "h-full" : "py-6"
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600">{message}</span>
      </div>
    </div>
  );
};

export default Loader;
