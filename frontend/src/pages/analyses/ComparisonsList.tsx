import { useEffect, useState } from "react";
import { Comparison as ComparisonType, getComparisons } from "../../api/hooks/comparisons";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import ItemCard from "../../components/common/ItemCard";

interface Comparison {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

const ComparisonsList = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComparisons = async () => {
      if (!analysisId) return;
      setLoading(true);
      try {
        const data: ComparisonType[] = await getComparisons(Number(analysisId));
        const mapped: Comparison[] = data.map(c => ({
          id: c.id,
          title: c.title || "Sem título",
          description: c.description || "",
          status: c.status || "Pendente",
          created_at: c.created_at || "",
        }));
        setComparisons(mapped);
      } catch (error) {
        console.error("Erro ao buscar comparações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisons();
  }, [analysisId]);

  if (loading) return <Loader />;

  return (
    <div>
      <PageHeader 
        title={`Comparações da Análise ${analysisId}`} 
        actionLabel="Criar Nova Comparação" 
        actionLink={`/analyses/${analysisId}/comparisons/new`} 
      />
      {comparisons.length === 0 ? (
        <p className="text-gray-500">Nenhuma comparação encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparisons.map(c => (
            <div key={c.id} className="border rounded shadow p-4 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2">
                <Link to={`/comparisons/${c.id}`} className="hover:underline">{c.title}</Link>
              </h3>
              <p className="text-sm text-gray-600 mb-2">{c.description}</p>
              <p className="text-sm"><strong>Status:</strong> {c.status}</p>
              <p className="text-sm text-gray-500">
                Criado em: {c.created_at ? new Date(c.created_at).toLocaleString() : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComparisonsList;
