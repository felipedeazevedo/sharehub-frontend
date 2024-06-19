import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Container, Paper, Grid, Button, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import getLPTheme from '../getLPTheme';
import Footer from './Footer';
import SellerInfoModal from './SellerInfoModal';
import NavBar from './NavBar';
import ProductSlideShow from './PicturesSlide';
import { displayCondition } from './utils/displayCondition';
import { displayCategory } from './utils/displayCategory';

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

const ProductDetail: React.FC = () => {
  const [selectedSeller, setSelectedSeller] = React.useState<User | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const location = useLocation();
  const postProps = location.state.post;

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
              <ProductSlideShow images={postProps.images}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {postProps.product.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                {postProps.product.description}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                Preço: R${postProps.product.price}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Categoria: {displayCategory(postProps.product.category)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Condição: {displayCondition(postProps.product.condition)}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Anunciante: {postProps.user.name}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleOpenModal(postProps.user)}>
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
