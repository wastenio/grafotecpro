// src/components/cases/CaseCard.tsx
import React from "react";
import { Case } from "../../api/cases";

interface CaseCardProps {
  caseData: Case;
}

const CaseCard: React.FC<CaseCardProps> = ({ caseData }) => {
  const formattedDate = caseData.created_at
    ? new Date(caseData.created_at).toLocaleString()
    : "Data não disponível";

  return (
    <div className="border rounded p-4 shadow-sm bg-white hover:shadow-md transition mb-4">
      <h2 className="text-xl font-semibold">{caseData.title}</h2>
      <p className="text-gray-700">{caseData.description}</p>
      {caseData.status && (
        <p className="text-sm text-gray-600">Status: {caseData.status}</p>
      )}
      <p className="text-sm text-gray-500">Criado em: {formattedDate}</p>
    </div>
  );
};

export default CaseCard;
