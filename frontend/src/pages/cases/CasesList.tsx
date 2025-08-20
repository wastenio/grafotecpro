// src/pages/cases/CasesList.tsx

import React, { useEffect, useState } from "react";
import { getCases } from "../../api/cases";
import CaseForm from "../../components/cases/CaseForm";

interface Case {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

const CasesList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchCases = () => {
    setLoading(true);
    getCases()
      .then((data) =>
        setCases(Array.isArray(data.results) ? data.results : [])
      )
      .catch(() => setError("Erro ao carregar cases"))
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchCases();
  }, []);

  // Callback para adicionar o case recém-criado no topo
  const handleNewCase = (newCase: Case) => {
    setCases((prevCases) => [newCase, ...prevCases]);
  };

  return (
    <div>
      <h1>Lista de Casos</h1>
      <CaseForm
        onCaseCreated={(newCase) => handleNewCase(newCase)} // adiciona no topo
      />
      {loading && <p>Carregando casos...</p>}
      {!loading && cases.length === 0 && <p>Nenhum caso encontrado.</p>}
      <ul>
        {cases.map((c) => (
          <li key={c.id}>
            <h2>{c.title}</h2>
            <p>{c.description}</p>
            <p>Status: {c.status}</p>
            <p>Criado em: {new Date(c.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CasesList;
