import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  actionLink?: string;
}

const PageHeader = ({ title, actionLabel, actionLink }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {actionLabel && actionLink && (
        <a
          href={actionLink}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
};

export default PageHeader;
