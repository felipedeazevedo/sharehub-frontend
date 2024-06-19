import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Button, TextField, ThemeProvider, createTheme, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent, Snackbar, Alert, Fade } from '@mui/material';
import axios from 'axios';
import getLPTheme from '../getLPTheme';
import Footer from './Footer';
import { ProductCategory } from './utils/category.enum';
import { ProductCondition } from './utils/condition.enum';
import { getUserIdFromToken } from './utils/getToken';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import 'react-toastify/dist/ReactToastify.css';
import { NumericFormat } from 'react-number-format';
import ImageUploader from './ImageUploader';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

interface NewProduct {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
}

interface Post {
    product: NewProduct;
    userId: number | null;
}

const productInitialState: NewProduct = {
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
};

const NewPost: React.FC = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<NewProduct>(productInitialState);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertErrorPictures, setShowAlertErrorPictures] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct:NewProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleValueChange = (values: { value: string }) => {
    handleChange({
      target: {
        name: 'price',
        value: values.value,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleChangeSelectCategory = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setProduct((prevProduct:NewProduct) => ({
      ...prevProduct,
      category: value,
    }));
  };

  const handleChangeSelectCondition = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setProduct((prevProduct:any) => ({
      ...prevProduct,
      condition: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const numericValue = parseFloat(product.price.replace(/\./g, '').replace(',', '.'));
    const formattedValue = numericValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const productToSubmit = {
      ...product,
      price: formattedValue
    };
    try {
        const newPost = {
            product: productToSubmit,
            userId: getUserIdFromToken()
        };
        const response = await axios.post(`${apiBaseUrl}/posts`, newPost,{
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      if (response.data.id) {
        submitPictures(response.data.id)
      }
      setShowAlert(true);
      setProduct(productInitialState);
    } catch (error) {
      handleShowAlertError();
    }
  };

  const submitPictures = async (postId: number) => {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append('pictures', image);
      });

      const pictures_reponse = await axios.post(`${apiBaseUrl}/posts/${postId}/pictures`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
      });
    } catch (error) {
      handleShowAlertErrorPictures()
    }
  }

  const handleShowAlertError = () => {
    setShowAlertError(true);
    setTimeout(() => {
      setShowAlertError(false);
    }, 2000);
  };

  const handleShowAlertErrorPictures = () => {
    setShowAlertErrorPictures(true);
    setTimeout(() => {
      setShowAlertErrorPictures(false);
    }, 2000);
  };

  const handleImageChange = (selectedFiles: File[]) => {
    setImages(selectedFiles);
  };

  const LPtheme = createTheme(getLPTheme('light'));

  return (
    <ThemeProvider theme={LPtheme}>
      <Box
      id="new-post"
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
        <NavBar/>
        <Container sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}>
            <Typography variant="h3" sx={{mb: 5}} gutterBottom>
              Anunciar equipamento médico
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="title"
                    label="Título"
                    value={product.title}
                    onChange={handleChange}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/*<TextField
                    required
                    fullWidth
                    name="price"
                    label="Preço"
                    value={product.price}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    InputProps={{
                      startAdornment: (showPrefix || product.price)&& <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />*/}
                  <NumericFormat
                    customInput={TextField}
                    required
                    fullWidth
                    name="price"
                    label="Preço"
                    value={product.price}
                    onValueChange={handleValueChange}
                    thousandSeparator="."
                    decimalSeparator=","
                    valueIsNumericString
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="description"
                    label="Descrição"
                    multiline
                    rows={1}
                    value={product.description}
                    onChange={handleChange}
                    inputProps={{ maxLength: 250 }}
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Categoria</InputLabel>
                    <Select
                      name="category"
                      value={product.category}
                      onChange={handleChangeSelectCategory}
                    >
                      {Object.keys(ProductCategory).map((category) => (
                        <MenuItem key={category} value={category}>
                          {ProductCategory[category as keyof typeof ProductCategory]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                    <InputLabel>Condição</InputLabel>
                    <Select
                      name="condition"
                      value={product.condition}
                      onChange={(e) => handleChangeSelectCondition(e)}
                    >
                      {Object.keys(ProductCondition).map((condition) => (
                        <MenuItem key={condition} value={condition}>
                          {ProductCondition[condition as keyof typeof ProductCondition]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <ImageUploader onChange={handleImageChange}/>
                <Grid container marginTop={4} xs={12} justifyContent="flex-end">
                  <Button type="submit" variant="contained" color="primary">
                    Anunciar
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
        anchorOrigin={{vertical: 'top',horizontal: 'center'}} 
        autoHideDuration={2000} 
        TransitionComponent={Fade}
        >
        <Alert
          onClose={() => navigate('/')}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Anúncio criado com sucesso!
        </Alert>
      </Snackbar>
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
          Erro ao criar anúncio!
        </Alert>
      </Snackbar>
      <Snackbar 
        open={showAlertErrorPictures} 
        anchorOrigin={{vertical: 'top',horizontal: 'center'}} 
        autoHideDuration={2000} 
        TransitionComponent={Fade}
        onClose={() => setShowAlertErrorPictures(false)}
        >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Erro ao salvar imagens do anúncio!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default NewPost;
