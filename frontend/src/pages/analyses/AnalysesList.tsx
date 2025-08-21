// src/pages/analyses/AnalysesList.tsx
import { useEffect, useState } from "react";
import { Analysis as AnalysisType, getAnalyses } from "../../api/hooks/useAnalyses";
import { useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import ItemCard from "../../components/common/ItemCard";

interface Analysis {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

const AnalysesList = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!caseId) return;
      setLoading(true);
      try {
        const data: AnalysisType[] = await getAnalyses(Number(caseId));
        // Mapear campos do backend para o formato esperado no frontend
        const mapped: Analysis[] = data.map(a => ({
          id: a.id,
          title: a.observation || "Sem título",
          description: a.methodology || "",
          status: a.conclusion ? "Concluída" : "Pendente",
          created_at: a.created_at || "",
        }));
        setAnalyses(mapped);
      } catch (error) {
        console.error("Erro ao buscar análises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [caseId]);

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Análises do Case {caseId}</h2>

      {analyses.length === 0 ? (
        <p className="text-gray-500">Nenhuma análise encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyses.map(a => (
            <ItemCard
              key={a.id}
              title={a.title}
              description={a.description}
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
