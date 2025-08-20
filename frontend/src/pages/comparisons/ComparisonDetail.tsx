import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComparisonDetail } from "../../api/hooks/comparisons";

const ComparisonDetail = () => {
  const { comparisonId } = useParams<{ comparisonId: string }>();
  const [comparison, setComparison] = useState<any>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!comparisonId) return;
      const data = await getComparisonDetail(Number(comparisonId));
      setComparison(data);
    };
    fetchDetail();
  }, [comparisonId]);

  if (!comparison) return <p>Carregando...</p>;

  return (
    <div>
      <h2>{comparison.title}</h2>
      <p>{comparison.description}</p>

      <h3>Visualização lado a lado</h3>
      {/* Aqui depois pode integrar o SideBySideViewer com os documentos */}
    </div>
  );
};

export default ComparisonDetail;
