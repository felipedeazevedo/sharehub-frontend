import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, CircularProgress, ThemeProvider, createTheme } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import getLPTheme from '../getLPTheme';
import NavBar from './NavBar';
import Footer from './Footer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

interface MaterialItem {
  name: string;
  description: string;
  mandatory: boolean;
}

interface MaterialList {
  id: number;
  semester: number;
  discipline: string;
  teacherId: number;
  active: boolean;
  items: MaterialItem[];
}

const MaterialListView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [materialList, setMaterialList] = useState<MaterialList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterialList();
  }, [id]);

  const fetchMaterialList = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/material-lists/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setMaterialList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar lista de material', error);
      setLoading(false);
    }
  };

  const LPtheme = createTheme(getLPTheme('light'));

  return (
    <ThemeProvider theme={LPtheme}>
      <Box
        id="material-list-view"
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
        <Container sx={{ pt: { xs: 14, sm: 20 }, pb: { xs: 8, sm: 12 } }}>
          {loading ? (
            <CircularProgress />
          ) : (
            materialList && (
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ArrowBackIcon 
                    sx={{ cursor: 'pointer', mr: 2 }}
                    onClick={() => navigate(-1)}
                  />
                  <Typography variant="h4" component="div">
                    {materialList.discipline}
                  </Typography>
                </Box>
                <Typography variant="h6">Semestre: {materialList.semester}</Typography>
                <Typography variant="h6">Ativo: {materialList.active ? 'Sim' : 'Não'}</Typography>
                <Typography variant="h6">Itens:</Typography>
                <List>
                  {materialList.items.map((item, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={item.name}
                        secondary={item.description}
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="body2">
                          Obrigatório? {item.mandatory ? 'Sim' : 'Não'}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )
          )}
        </Container>
      </Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default MaterialListView;
