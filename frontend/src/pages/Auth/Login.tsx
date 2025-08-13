import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useLogin, useMe } from '../../api/hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

type Form = { email: string; password: string; };

export default function Login() {
  const { register, handleSubmit } = useForm<Form>();
  const login = useLogin();
  const navigate = useNavigate();
  const access = useAuthStore(s => s.access);
  const me = useMe(!!access);

  useEffect(() => {
    if (me.data || access) navigate('/cases');
  }, [me.data, access, navigate]);

  const onSubmit = (data: Form) => login.mutate(data, {
    onSuccess: () => navigate('/cases'),
  });

  return (
    <Box sx={{ display:'grid', placeItems:'center', height:'100vh' }}>
      <Paper sx={{ p:4, width: 360 }}>
        <Typography variant="h6" gutterBottom>Entrar</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField label="E-mail" {...register('email')} />
          <TextField label="Senha" type="password" {...register('password')} />
          <Button type="submit" fullWidth sx={{ mt:2 }} disabled={login.isLoading}>
            Acessar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
