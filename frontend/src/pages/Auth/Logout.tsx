import { useEffect } from "react";
import { useLogout } from "@/api/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { mutate } = useLogout(); // pega a função mutate
  const navigate = useNavigate();

  useEffect(() => {
    // Executa o logout
    mutate(undefined, {
      onSuccess: () => {
        navigate("/login", { replace: true });
      },
      onError: (error) => {
        console.error("Erro ao deslogar:", error);
        // Mesmo assim, redireciona
        navigate("/login", { replace: true });
      },
    });
  }, [mutate, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-700">Saindo da aplicação...</p>
    </div>
  );
};

export default Logout;
