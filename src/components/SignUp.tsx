import React from 'react';
import { Box, Button, Container, CssBaseline, FormControlLabel, Grid, Link, TextField, Typography, ThemeProvider, FormControl, FormLabel, RadioGroup, Radio, Snackbar, Alert, Fade } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import getLPTheme from '../getLPTheme';
import SharehubIcon from './SharehubIcon';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

function SignUp() {
  const LPtheme = createTheme(getLPTheme('light'));
  const [userType, setUserType] = React.useState('');
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');
  const [registration, setRegistration] = React.useState('');

  const handleRegistrationChange = (event:any) => {
    if (/^UC\d{8}$/.test(event.target.value)) {
      setRegistration(event.target.value);
    }
  };

  const handleUserType = (event:any) => {
    setUserType(event.target.value);
  };

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  
    const formData = {
      name: data.get('firstName'),
      email: data.get('email'),
      registration: data.get('registration'),
      type: userType,
      password: data.get('password'),
      phone: data.get('phone'),
    };
  
    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || 'Falha ao registrar');
      }
  
      localStorage.setItem('accessToken', responseData.accessToken);
      navigate('/');
    } catch (error) {
      let errorMessage = 'Erro desconhecido ao registrar';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setAlertMessage(errorMessage);
      setShowAlert(true);
      setAlertSeverity('error');
    }
  };

  const handleLogin = () => {
    navigate(`/login`);
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
            Crie uma nova conta
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Nome"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="registration"
                  label="Matrícula"
                  name="registration"
                  autoComplete="family-name"
                  onChange={handleRegistrationChange}
                  inputProps={{ maxLength: 10 }} 
                  error={!/^UC\d{8}$/.test(registration)} 
                  helperText={registration && !/^UC\d{8}$/.test(registration) ? 'Formato incorreto. Exemplo: UC12345678' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                required
                fullWidth
                name="phone"
                label="Telefone"
                id="phone"
                autoComplete="tel"
                inputProps={{ maxLength: 11, pattern: "[0-9]*" }}
                />
              </Grid>
              <Grid item spacing={2} xs={12}>
                  <FormControl component="fieldset">
                    <RadioGroup row aria-label="role" name="role" value={userType} onChange={handleUserType}>
                      <FormControlLabel value="STUDENT" control={<Radio />} label="Sou aluno" />
                      <FormControlLabel value="TEACHER" control={<Radio />} label="Sou professor" />
                    </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Criar conta
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={() => handleLogin()}>
                  Já possui conta? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Snackbar
        open={showAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
        TransitionComponent={Fade}
        onClose={() => setShowAlert(false)}
      >
        <Alert
          severity={alertSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default SignUp;