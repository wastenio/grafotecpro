import React from "react";

interface Case {
  id: number;
  title: string;
  description: string;
  status: string;
}

const mockCases: Case[] = [
  { id: 1, title: "Caso 001", description: "Documento contestado A", status: "Aberto" },
  { id: 2, title: "Caso 002", description: "Documento contestado B", status: "Em análise" },
  { id: 3, title: "Caso 003", description: "Documento contestado C", status: "Concluído" },
];

const CasesList: React.FC = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h2>Meus Casos</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {mockCases.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{c.description}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CasesList;
