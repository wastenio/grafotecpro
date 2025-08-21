// src/pages/cases/CasesList.tsx
import React, { useEffect, useState } from "react";
import { getCases } from "../../api/cases";
import CaseForm from "../../components/cases/CaseForm";
import CaseCard from "../../components/cases/CaseCard";

interface Case {
  id: number;
  title: string;
  description?: string;
  status: string;
  created_at: string;
}

const CasesList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await getCases(); // já retorna array diretamente
      setCases(data);
    } catch (err) {
      console.error("Erro ao carregar cases:", err);
      setError("Erro ao carregar cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await getCases();
      setCases(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Erro ao carregar cases");
    } finally {
      setLoading(false);
    }
  };
  fetchCases();
}, []);


  // Callback para adicionar o case recém-criado no topo
  const handleNewCase = (newCase: Case) => {
    setCases((prev) => [newCase, ...prev]);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h1>Lista de Casos</h1>
      <CaseForm onCaseCreated={handleNewCase} />

      {loading && <p>Carregando casos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && cases.length === 0 && <p>Nenhum caso encontrado.</p>}

      {cases.map((c) => (
        <CaseCard
          key={c.id}
          id={c.id}
          title={c.title}
          description={c.description}
          status={c.status}
          created_at={c.created_at}
        />
      ))}
    </div>
  );
};

export default CasesList;
