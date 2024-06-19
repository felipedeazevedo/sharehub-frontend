import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  TextField,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
  Fade,
} from '@mui/material';
import axios from 'axios';
import NavBar from './NavBar';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';
import getLPTheme from '../getLPTheme';
import DeleteModal from './DeleteModal';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

interface User {
    name: string;
    email: string;
    phone: string;
    registration: string;
}

const UserProfile: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    phone: '',
    registration: ''
  });
  const [editable, setEditable] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertErrorRecuperar, setShowAlertErrorRecuperar] = useState(false);
  const [showAlertDeletar, setShowAlertDeletar] = useState(false);
  const [showAlertErrorDeletar, setShowAlertErrorDeletar] = useState(false);
  const [showAlertErrorDeletarAnuncioAtivo, setShowAlertErrorDeletarAnuncioAtivo] = useState(false);
  const [isModalOpenDeletion, setIsModalOpenDeletion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        const { name, email, registration, phone } = response.data;
        const userData: User = { name, email, registration, phone };
        setUser(userData);
      } catch (error) {
        handleShowAlertError();
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser: any) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditable(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${apiBaseUrl}/users/${userId}`, user, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setShowAlert(true);
      setEditable(false);
      localStorage.setItem('accessToken', response.data.accessToken);
    } catch (error) {
      handleShowAlertError();
    }
  };

  const handleDeleteClickDeletion = () => {
    setIsModalOpenDeletion(true);
  };

  const handleCloseModalDeletion = () => {
    setIsModalOpenDeletion(false);
  };

  const handleDelete = async () => {
    try {
        const reponse: any = await axios.get(`${apiBaseUrl}/posts/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          });

        if (reponse.data.length > 0) {
            handleShowAlertErrorDeletarAnuncioAtivo();
        } else {
            await axios.delete(`${apiBaseUrl}/users/${userId}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
              });
              localStorage.clear();
              navigate('/')
        }
    } catch (error) {
        handleShowAlertErrorDeletar();
    }
  };

  const handleShowAlertError = () => {
    setShowAlertError(true);
    setTimeout(() => {
      setShowAlertError(false);
    }, 2000);
  };

  const handleShowAlertErrorDeletar = () => {
    setShowAlertErrorDeletar(true);
    setTimeout(() => {
      setShowAlertErrorDeletar(false);
    }, 2000);
  };

  const handleShowAlertErrorDeletarAnuncioAtivo = () => {
    setShowAlertErrorDeletarAnuncioAtivo(true);
    setTimeout(() => {
        setShowAlertErrorDeletarAnuncioAtivo(false);
    }, 2000);
  };

  const handleVoltar = () => {
    navigate(`/`);
  };

  const LPtheme = createTheme(getLPTheme('light'));

  return (
    <ThemeProvider theme={LPtheme}>
      <Box
        id="user-profile"
        sx={(theme) => ({
          width: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
          ...theme.applyStyles('dark', {
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
          }),
        })}
      >
        <NavBar />
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 14, sm: 20 },
            pb: { xs: 8, sm: 12 },
          }}
        >
          <Typography variant="h3" sx={{ mb: 5 }} gutterBottom>
            Perfil do Usuário
          </Typography>
          <form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Nome"
                  value={user.name || ''}
                  onChange={handleChange}
                  InputProps={{ readOnly: !editable }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="registration"
                  label="Matrícula"
                  value={user.registration || ''}
                  onChange={handleChange}
                  InputProps={{ readOnly: !editable }}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={user.email || ''}
                  onChange={handleChange}
                  InputProps={{ readOnly: !editable }}
                  inputProps={{
                    pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                    maxLength: 100
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Telefone"
                  value={user.phone || ''}
                  onChange={handleChange}
                  InputProps={{
                    inputProps: {
                      maxLength: 11,
                      pattern: "[0-9]*",
                      readOnly: !editable
                    }
                  }}
                />
              </Grid>
              <Grid container item marginTop={2} xs={12}>
                <Grid item xs={6}>
                    <Button onClick={handleVoltar} variant="contained" color="primary">
                    Voltar
                    </Button>
                </Grid>
                <Grid item xs={6} container justifyContent="flex-end">
                <Grid item xs={3} container justifyContent="flex-end">
                    <Button onClick={() => handleDeleteClickDeletion()} variant="contained" color="error">
                        Encerrar conta
                    </Button>
                </Grid>
                {editable ? (
                    <Grid item xs={3} container justifyContent="flex-end">
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Salvar
                    </Button>
                    </Grid>
                ) : (
                    <Grid item xs={3} container justifyContent="flex-end">
                    <Button onClick={handleEdit} variant="contained" color="primary">
                        Editar
                    </Button>
                    </Grid>
                )}
                </Grid>
             </Grid>
            </Grid>
          </form>
          <DeleteModal 
            open={isModalOpenDeletion} 
            onClose={handleCloseModalDeletion} 
            onConfirm={() => handleDelete()}
            message='Tem certeza que deseja encerrar sua conta?'
          />
        </Container>
      </Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Footer />
      </Box>
      <Snackbar
        open={showAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
        TransitionComponent={Fade}
        onClose={() => setShowAlert(false)}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Informações atualizadas com sucesso!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showAlertError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
        TransitionComponent={Fade}
        onClose={() => setShowAlertError(false)}
      >
        <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
          Erro ao atualizar informações!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showAlertErrorDeletar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
        TransitionComponent={Fade}
        onClose={() => setShowAlertErrorDeletar(false)}
      >
        <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
          Erro ao deletar conta!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showAlertErrorDeletarAnuncioAtivo}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
        TransitionComponent={Fade}
        onClose={() => setShowAlertErrorDeletarAnuncioAtivo(false)}
      >
        <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
          Usuário possui anúncios ativos!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default UserProfile;