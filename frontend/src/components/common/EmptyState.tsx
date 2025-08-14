// src/components/common/EmptyState.tsx
import React from "react";
import { FiInbox } from "react-icons/fi";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Nada por aqui",
  description = "Não encontramos nenhum item para exibir.",
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
      <div className="mb-4 text-5xl text-gray-400">
        {icon || <FiInbox />}
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
