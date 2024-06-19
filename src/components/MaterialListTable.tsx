import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar, Alert, Fade, createTheme, ThemeProvider, Stack } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';
import getLPTheme from '../getLPTheme';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import { getUserIdFromToken, getUserTypeFromToken } from './utils/getToken';
import DeleteModal from './DeleteModal';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

interface MaterialItem {
  name: string;
  description: string;
  mandatory: boolean;
}

interface Teacher {
  name: string;
  id: number;
}

interface MaterialList {
  id: number;
  semester: number;
  discipline: string;
  teacher: Teacher;
  active: boolean;
  items: MaterialItem[];
}

const MaterialListTable: React.FC = () => {
  const navigate = useNavigate();
  const [materialLists, setMaterialLists] = useState<MaterialList[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [isModalOpenDeletion, setIsModalOpenDeletion] = useState(false);
  const [listId, setListId] = useState<number | null>();

  useEffect(() => {
    fetchMaterialLists();
  }, []);

  const fetchMaterialLists = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/material-lists`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setMaterialLists(response.data);
    } catch (error) {
      setAlertMessage('Erro ao carregar listas de material');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };

  const handleView = (id: number) => {
    navigate(`/listas-material/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/material-lists/edit/${id}`);
  };

  const handleDelete = async (id: number | null | undefined) => {
    try {
      if (id) {
        await axios.delete(`${apiBaseUrl}/material-lists/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setAlertMessage('Lista de material removida com sucesso');
        setAlertSeverity('success');
        fetchMaterialLists();
      }
      setIsModalOpenDeletion(false)
    } catch (error) {
      setAlertMessage('Erro ao remover lista de material');
      setAlertSeverity('error');
    }
    setShowAlert(true);
  };

  const handleCloseModalDeletion = () => {
    setIsModalOpenDeletion(false);
    setListId(null)
  };

  const handleDeleteClickDeletion = (id: number) => {
    setIsModalOpenDeletion(true);
    setListId(id)
  };

  const LPtheme = createTheme(getLPTheme('light'));

  return (
    <ThemeProvider theme={LPtheme}>
      <Box
        id="material-list-table"
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
        <Container sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}>
          <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
            }}
          >
            Listas de&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              material
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            Explore listas disponibilizadas pelos próprios docentes do curso de medicina da Universidade Católica de Brasília
          </Typography>
        </Stack>
          <TableContainer component={Paper} sx={{mt: 4}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Disciplina</TableCell>
                  <TableCell>Professor</TableCell>
                  <TableCell>Semestre</TableCell>
                  <TableCell>Ativo</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materialLists.map((list) => (
                  <TableRow key={list.id}>
                    <TableCell>{list.discipline}</TableCell>
                    <TableCell>{list.teacher.name}</TableCell>
                    <TableCell>{list.semester}</TableCell>
                    <TableCell>{list.active ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleView(list.id)}>
                        <VisibilityIcon />
                      </IconButton>
                      {(getUserTypeFromToken() === 'TEACHER' && list.teacher.id === getUserIdFromToken())  
                      && <IconButton onClick={() => handleEdit(list.id)}>
                        <EditIcon />
                      </IconButton>}
                      {(getUserTypeFromToken() === 'TEACHER' && list.teacher.id === getUserIdFromToken())  
                      && <IconButton onClick={() => handleDeleteClickDeletion(list.id)}>
                        <DeleteIcon />
                      </IconButton>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <DeleteModal 
            open={isModalOpenDeletion} 
            onClose={handleCloseModalDeletion} 
            onConfirm={() => handleDelete(listId)}
            message='Tem certeza que deseja deletar esta lista?'
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
};

export default MaterialListTable;
