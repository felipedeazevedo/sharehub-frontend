import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Button, TextField, ThemeProvider, createTheme, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent, Snackbar, Alert, Fade, IconButton } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import axios from 'axios';
import getLPTheme from '../getLPTheme';
import Footer from './Footer';
import { getUserIdFromToken } from './utils/getToken';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

interface MaterialItem {
  name: string;
  description: string;
  mandatory: boolean;
}

interface MaterialList {
  semester: number;
  discipline: string;
  teacherId: number | null;
  active: boolean;
  items: MaterialItem[];
}

const materialListInitialState: MaterialList = {
  semester: 1,
  discipline: '',
  teacherId: getUserIdFromToken(),
  active: true,
  items: [{ name: '', description: '', mandatory: false }],
};

const NewMaterialList: React.FC = () => {
  const navigate = useNavigate();
  const [materialList, setMaterialList] = useState<MaterialList>(materialListInitialState);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMaterialList((prevMaterialList: MaterialList) => ({
      ...prevMaterialList,
      [name]: name === 'semester' ? Number(value) : value,
    }));
  };

  const handleItemChange = (index: number, e: any) => {
    const { name, value, type, checked } = e.target;
    const itemValue = type === 'checkbox' ? checked : (name === 'mandatory' ? value === 'true' : value);
    const updatedItems = [...materialList.items];
    updatedItems[index] = { ...updatedItems[index], [name!]: itemValue };
    setMaterialList((prevMaterialList: MaterialList) => ({
      ...prevMaterialList,
      items: updatedItems,
    }));
  };
  

  const addItem = () => {
    setMaterialList((prevMaterialList: MaterialList) => ({
      ...prevMaterialList,
      items: [...prevMaterialList.items, { name: '', description: '', mandatory: false }],
    }));
  };

  const removeItem = (index: number) => {
    setMaterialList((prevMaterialList: MaterialList) => ({
      ...prevMaterialList,
      items: prevMaterialList.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiBaseUrl}/material-lists`, materialList, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setShowAlert(true);
      setMaterialList(materialListInitialState);
    } catch (error) {
      handleShowAlertError();
    }
  };

  const handleShowAlertError = () => {
    setShowAlertError(true);
    setTimeout(() => {
      setShowAlertError(false);
    }, 2000);
  };

  const LPtheme = createTheme(getLPTheme('light'));

  return (
    <ThemeProvider theme={LPtheme}>
      <Box
        id="new-material-list"
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
          <Typography variant="h3" sx={{ mb: 5 }} gutterBottom>
            Cadastro de Lista de Material
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="semester"
                  label="Semestre"
                  type="number"
                  value={materialList.semester}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="discipline"
                  label="Disciplina"
                  value={materialList.discipline}
                  onChange={handleChange}
                />
              </Grid>
              {materialList.items.map((item, index) => (
                <Grid container spacing={2} key={index} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      fullWidth
                      name="name"
                      label="Nome do Item"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="description"
                      label="Descrição"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth>
                      <InputLabel>Obrigatório</InputLabel>
                      <Select
                        name="mandatory"
                        value={item.mandatory.toString()}
                        onChange={(e) => handleItemChange(index, e)}
                      >
                        <MenuItem value="true">Sim</MenuItem>
                        <MenuItem value="false">Não</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => removeItem(index)} color="secondary">
                      <RemoveIcon />
                    </IconButton>
                    {index === materialList.items.length - 1 && (
                      <IconButton onClick={addItem} color="primary">
                        <AddIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
              <Grid container marginTop={4} xs={12} justifyContent="flex-end">
                <Button type="submit" variant="contained" color="primary">
                  Cadastrar Lista
                </Button>
              </Grid>
            </Grid>
          </form>
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
      >
        <Alert
          onClose={() => navigate('/listas-material')}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Lista de material cadastrada com sucesso!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showAlertError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
        TransitionComponent={Fade}
        onClose={() => setShowAlertError(false)}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Erro ao cadastrar lista de material!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default NewMaterialList;
