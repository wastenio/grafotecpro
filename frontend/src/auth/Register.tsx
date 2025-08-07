import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './authService';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    is_expert: true,
    is_client: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert('Usuário registrado com sucesso!');
      navigate('/');
    } catch (error) {
      alert('Erro ao registrar. Verifique os dados.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-6 rounded shadow w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Cadastro</h2>
        <input type="email" name="email" placeholder="Email" className="mb-2 w-full border p-2 rounded" onChange={handleChange} required />
        <input type="text" name="username" placeholder="Nome de usuário" className="mb-2 w-full border p-2 rounded" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Senha" className="mb-2 w-full border p-2 rounded" onChange={handleChange} required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Cadastrar</button>
        <p className="mt-2 text-sm text-center">Já tem conta? <a className="text-blue-500" href="/">Entrar</a></p>
      </form>
    </div>
  );
}
