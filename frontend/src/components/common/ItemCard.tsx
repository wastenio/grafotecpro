// src/components/common/ItemCard.tsx
import React from "react";

export interface ItemCardProps {
  title: string;
  description?: string;
  actionLabel?: string;  // nova prop
  actionLink?: string;   // nova prop
}

const ItemCard: React.FC<ItemCardProps> = ({ title, description, actionLabel, actionLink }) => {
  return (
    <div className="p-4 border rounded shadow-sm hover:shadow-md transition-all">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-2">{description}</p>}
      {actionLabel && actionLink && (
        <a href={actionLink} className="text-blue-500 hover:underline">{actionLabel}</a>
      )}
    </div>
  );
};

export default ItemCard;
