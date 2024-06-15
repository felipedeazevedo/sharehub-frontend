import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Paper, Grid, Button, CssBaseline, ThemeProvider, createTheme, PaletteMode, Divider } from '@mui/material';
import axios from 'axios';
import getLPTheme from '../getLPTheme';
import Footer from './Footer';
import SellerInfoModal from './SellerInfoModal';
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
  email:string;
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

const fetchProductImages = async (postId: number): Promise<string[]> => {
  try {
    const response = await axios.get(`http://localhost:3001/pictures/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching images for post ${postId}:`, error);
    return [];
  }
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedSeller, setSelectedSeller] = React.useState<User | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    const getPost = async () => {
      if (id) {
        const postData = await fetchPostById(Number(id));
        setPost(postData);

        if (postData) {
          const imagesData = await fetchProductImages(postData.id);
          setImages(imagesData);
        }
      }
    };
    getPost();
  }, [id]);

  if (!post) {
    return <Typography>Loading...</Typography>;
  }

  const handleOpenModal = (seller: User) => {
    setSelectedSeller(seller);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSeller(null);
  };


  const LPtheme = createTheme(getLPTheme('light'));

  return (
    <ThemeProvider theme={LPtheme}>
    <CssBaseline />
    <NavBar/>
      <Container>
        <Paper sx={{ p: 4, mt: 20 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              {images.map((image: any, index:any) => (
                <Box key={index} sx={{ mb: 2 }}>
                  
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {post.product.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                {post.product.description}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                Preço: R${post.product.price}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Categoria: {post.product.category}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Condição: {post.product.condition}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Anunciante: {post.user.name}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleOpenModal(post.user)}>
                Comprar agora
              </Button>
            </Grid>
          </Grid>
        </Paper>
        {selectedSeller && (
          <SellerInfoModal
            open={modalOpen}
            handleClose={handleCloseModal}
            seller={selectedSeller}
          />
        )}
      </Container>
    <Box sx={{ bgcolor: 'background.default' }}>
        <Footer />
    </Box>
  </ThemeProvider>
  );
};

export default ProductDetail;
