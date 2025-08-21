// src/pages/analyses/AnalysesList.tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Analysis as AnalysisType, getAnalyses } from "../../api/hooks/useAnalyses";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import ItemCard from "../../components/common/ItemCard";

interface Analysis {
  id: number;
  title: string;
  description?: string;
  status: string;
  created_at?: string;
}

const AnalysesList = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!caseId) return;
      setLoading(true);
      setError("");
      try {
        const data: AnalysisType[] = await getAnalyses(Number(caseId));
        const mapped: Analysis[] = data.map(a => ({
          id: a.id,
          title: a.observation || "Sem título",
          description: a.methodology || "",
          status: a.conclusion ? "Concluída" : "Pendente",
          created_at: a.created_at,
        }));
        setAnalyses(mapped);
      } catch (err) {
        console.error("Erro ao buscar análises:", err);
        setError("Não foi possível carregar as análises.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [caseId]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <PageHeader
        title={`Análises do Case ${caseId}`}
        actionLabel="Criar Nova Análise"
        actionLink={`/cases/${caseId}/analyses/new`}
      />

      {analyses.length === 0 ? (
        <p>Nenhuma análise encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyses.map(a => (
            <ItemCard
              key={a.id}
              title={a.title}
              description={`${a.status} • ${a.created_at ? new Date(a.created_at).toLocaleString() : ""}`}
              actionLabel="Ver Detalhes"
              actionLink={`/analyses/${a.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysesList;
