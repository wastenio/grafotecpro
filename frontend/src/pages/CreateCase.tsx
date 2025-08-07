import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function CreateCase() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/cases/', form);
      alert('Caso criado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      alert('Erro ao criar caso.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Novo Caso Pericial</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Título do caso" className="w-full border p-2 rounded" onChange={handleChange} required />
        <textarea name="description" placeholder="Descrição" className="w-full border p-2 rounded" rows={4} onChange={handleChange} />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Criar Caso</button>
      </form>
    </div>
  );
}
