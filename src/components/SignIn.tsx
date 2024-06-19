import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SharehubIcon from './SharehubIcon';
import getLPTheme from '../getLPTheme';
import { Alert, Fade, Snackbar } from '@mui/material';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const SignIn: React.FC = () => {
  const LPtheme = createTheme(getLPTheme('light'));
  const navigate = useNavigate();
  const [showAlertError, setShowAlertError] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const formData = {
      email: data.get('email') as string,
      password: data.get('password') as string,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to login';
        if (response.status === 401) {
          errorMessage = 'Unauthorized - Check your email and password';
        } else if (response.status === 500) {
          errorMessage = 'Internal Server Error - Please try again later';
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      localStorage.setItem('accessToken', responseData.accessToken);
      navigate('/');
    } catch (error: any) {
      handleShowAlertError();
      console.error('Error logging in:', error.message);
    }
  };

  const handleSignup = () => {
    navigate(`/cadastro`);
  };

  const handleForgot = () => {
    navigate(`/redefinir-senha`);
  };

  const handleShowAlertError = () => {
    setShowAlertError(true);
    setTimeout(() => {
      setShowAlertError(false);
    }, 2000);
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
            Acesse sua conta
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => handleForgot()}>
                  Esqueceu sua senha?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={() => handleSignup()}>
                  {"Ainda não tem conta? Crie uma"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Snackbar 
        open={showAlertError} 
        anchorOrigin={{vertical: 'top',horizontal: 'center'}} 
        autoHideDuration={2000} 
        TransitionComponent={Fade}
        onClose={() => setShowAlertError(false)}
        >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          E-mail e/ou senha incorretos!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default SignIn;
