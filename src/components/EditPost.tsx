import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Paper, Grid, Button, TextField, CssBaseline, ThemeProvider, createTheme, PaletteMode } from '@mui/material';
import axios from 'axios';
import getLPTheme from '../getLPTheme';
import Footer from './Footer';
import NavBar from './NavBar';

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
}

interface User {
  id: number;
  name: string;
  registration: string;
  phone: string;
  email: string;
}

interface Post {
  id: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  product: Product;
  user: User;
}

const fetchPostById = async (id: number): Promise<Post | null> => {
  try {
    const response = await axios.get(`http://localhost:3001/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with id ${id}:`, error);
    return null;
  }
};

const updatePost = async (id: number, postData: Post): Promise<Post | null> => {
  try {
    const response = await axios.put(`http://localhost:3001/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error(`Error updating post with id ${id}:`, error);
    return null;
  }
};

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  //const history = useHistory();
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    const getPost = async () => {
      if (id) {
        const postData = await fetchPostById(Number(id));
        setPost(postData);
        if (postData) {
          setFormData(postData.product);
        }
      }
    };
    getPost();
  }, [id]);

  if (!post) {
    return <Typography>Loading...</Typography>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (post) {
      const updatedPost = {
        ...post,
        product: {
          ...post.product,
          ...formData,
        },
      };
      const result = await updatePost(post.id, updatedPost);
    }
  };

  const LPtheme = createTheme(getLPTheme('light'));

  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <NavBar />
      <Container>
        <Paper sx={{ p: 4, mt: 20 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                  Editar Anúncio
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Título"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Preço"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Categoria"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Condição"
                  name="condition"
                  value={formData.condition || ''}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default EditPost;
