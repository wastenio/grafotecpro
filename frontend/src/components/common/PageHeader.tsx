// src/components/common/PageHeader.tsx
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  actionLink?: string;
  actionOnClick?: () => void; // Caso queira ação via função
  children?: ReactNode;        // Para adicionar elementos extras
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  actionLabel,
  actionLink,
  actionOnClick,
  children,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex items-center space-x-2">
        {children}
        {actionLabel && (actionLink || actionOnClick) && (
          <>
            {actionLink ? (
              <Link
                to={actionLink}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {actionLabel}
              </Link>
            ) : (
              <button
                onClick={actionOnClick}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {actionLabel}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
