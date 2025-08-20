import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import { getCaseDetail } from "../../api/cases";

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const [caseDetail, setCaseDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCaseDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getCaseDetail(Number(id));
      setCaseDetail(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetail();
  }, [id]);

  if (loading) return <Typography>Carregando...</Typography>;
  if (!caseDetail) return <Typography>Caso não encontrado</Typography>;

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4">{caseDetail.title}</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {caseDetail.description || "Sem descrição"}
      </Typography>
      {/* Aqui você pode adicionar componentes para análises e quesitos futuramente */}
    </Container>
  );
}
