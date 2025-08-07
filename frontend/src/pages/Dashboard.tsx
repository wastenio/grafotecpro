import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Case = {
  id: number;
  title: string;
  description: string;
  status: string;
};

export default function Dashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const { logout } = useAuth();

  useEffect(() => {
    api.get('/cases/')
      .then(res => setCases(res.data))
      .catch(() => alert('Erro ao carregar os casos'));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Seus Casos Periciais</h1>

      {cases.length === 0 ? (
        <p>Nenhum caso encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {cases.map(c => (
            <li key={c.id} className="p-4 bg-white rounded shadow">
              <strong>{c.title}</strong>
              <p>{c.description}</p>
              <span className="text-sm text-gray-500 block mb-2">{c.status}</span>

              <Link to={`/cases/${c.id}/upload`}>
                <button className="text-sm bg-blue-500 text-white p-1 px-3 rounded mr-2">Upload</button>
              </Link>

              <Link to={`/cases/${c.id}/documents`}>
                <button className="text-sm bg-gray-600 text-white p-1 px-3 rounded mr-2">Ver Docs</button>
              </Link>

              <Link to={`/cases/${c.id}/analyses`}>
                <button className="text-sm bg-purple-600 text-white p-1 px-3 rounded">Ver Análises</button>
              </Link>
            </li>
          ))}

        </ul>
      )}

      <Link to="/cases/new">
        <button className="mt-6 bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Novo Caso
        </button>
      </Link>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" >
        Sair
      </button>
    </div>
  );
}
