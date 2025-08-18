// src/components/analysis/FiltersBar.tsx
import React, { useState } from "react";

interface FiltersBarProps {
  onFilterChange: (filters: FiltersState) => void;
}

export interface FiltersState {
  searchText: string;
  minScore?: number;
  maxScore?: number;
  startDate?: string; // formato ISO: yyyy-MM-dd
  endDate?: string;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FiltersState>({
    searchText: "",
    minScore: undefined,
    maxScore: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const handleChange = (field: keyof FiltersState, value: string | number | undefined) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4 items-end p-4 bg-gray-50 border rounded-md">
      {/* Pesquisa por texto */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Pesquisar</label>
        <input
          type="text"
          value={filters.searchText}
          onChange={(e) => handleChange("searchText", e.target.value)}
          className="border rounded p-2 w-48"
          placeholder="Digite palavras-chave"
        />
      </div>

      {/* Score mínimo */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Score mínimo (%)</label>
        <input
          type="number"
          value={filters.minScore ?? ""}
          onChange={(e) => handleChange("minScore", e.target.value ? Number(e.target.value) : undefined)}
          className="border rounded p-2 w-24"
          min={0}
          max={100}
        />
      </div>

      {/* Score máximo */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Score máximo (%)</label>
        <input
          type="number"
          value={filters.maxScore ?? ""}
          onChange={(e) => handleChange("maxScore", e.target.value ? Number(e.target.value) : undefined)}
          className="border rounded p-2 w-24"
          min={0}
          max={100}
        />
      </div>

      {/* Data inicial */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Data inicial</label>
        <input
          type="date"
          value={filters.startDate ?? ""}
          onChange={(e) => handleChange("startDate", e.target.value || undefined)}
          className="border rounded p-2 w-36"
          max={filters.endDate}
        />
      </div>

      {/* Data final */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Data final</label>
        <input
          type="date"
          value={filters.endDate ?? ""}
          onChange={(e) => handleChange("endDate", e.target.value || undefined)}
          className="border rounded p-2 w-36"
          min={filters.startDate}
        />
      </div>

      {/* Botão limpar filtros */}
      <button
        type="button"
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => {
          const cleared = { searchText: "", minScore: undefined, maxScore: undefined, startDate: undefined, endDate: undefined };
          setFilters(cleared);
          onFilterChange(cleared);
        }}
      >
        Limpar filtros
      </button>
    </div>
  );
};

export default FiltersBar;
