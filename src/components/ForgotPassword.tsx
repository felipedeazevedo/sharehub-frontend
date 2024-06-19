import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SharehubIcon from './SharehubIcon';
import getLPTheme from '../getLPTheme';
import { toast } from 'react-toastify';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const ForgotPassword: React.FC = () => {
  const LPtheme = createTheme(getLPTheme('light'));
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const formData = {
      email: data.get('email') as string,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/auth/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to login';
        if (response.status === 401) {
          errorMessage = 'Não autorizado. Cheque o email';
        } else if (response.status === 500) {
          errorMessage = 'Erro interno';
        }
        throw new Error(errorMessage);
      }
      toast.success("Email enviado")

      const responseData = await response.json();
      localStorage.setItem('accessToken', responseData.accessToken);
      toast.success("Email enviado")
      navigate('/');
    } catch (error: any) {
      console.error('Error logging in:', error.message);
    }
  };

  const handleSignup = () => {
    navigate(`/cadastro`);
  };

  return (
    <ThemeProvider theme={LPtheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <SharehubIcon/>
          <Typography component="h1" variant="h6">
            Redefinir senha
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Receber senha temporária por email
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ForgotPassword;
