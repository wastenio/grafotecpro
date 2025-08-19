import React from "react";
import { useParams } from "react-router-dom";

interface Analysis {
  id: number;
  title: string;
  result: string;
}

interface Quesito {
  id: number;
  question: string;
  answer?: string;
}

interface Case {
  id: number;
  title: string;
  description: string;
  status: string;
  analyses: Analysis[];
  quesitos: Quesito[];
}

const mockCase: Case = {
  id: 1,
  title: "Caso 001",
  description: "Documento contestado A",
  status: "Aberto",
  analyses: [
    { id: 1, title: "Análise de assinatura", result: "Sem alterações detectadas" },
    { id: 2, title: "Análise de papel", result: "Papel original" },
  ],
  quesitos: [
    { id: 1, question: "A assinatura é autêntica?" },
    { id: 2, question: "Há indícios de falsificação?" },
  ],
};

const CaseDetail: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();

  // Aqui você poderia buscar o caso pelo ID
  const caso = mockCase.id === Number(caseId) ? mockCase : null;

  if (!caso) return <p>Caso não encontrado.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h2>{caso.title}</h2>
      <p>{caso.description}</p>
      <p>Status: {caso.status}</p>

      <h3>Análises</h3>
      <ul>
        {caso.analyses.map((a) => (
          <li key={a.id}>
            <strong>{a.title}:</strong> {a.result}
          </li>
        ))}
      </ul>

      <h3>Quesitos</h3>
      <ul>
        {caso.quesitos.map((q) => (
          <li key={q.id}>
            <strong>Pergunta:</strong> {q.question} <br />
            <strong>Resposta:</strong> {q.answer || "Ainda não respondido"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaseDetail;
