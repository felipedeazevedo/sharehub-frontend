import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent, CssBaseline, IconButton, ThemeProvider, createTheme } from '@mui/material';
import axios from 'axios';
import SellerInfoModal from './SellerInfoModal';
import { useNavigate, useParams } from 'react-router-dom';
import { displayCondition } from './utils/displayCondition';
import ProductSlideShow from './PicturesSlide';
import Footer from './Footer';
import getLPTheme from '../getLPTheme';
import NavBar from './NavBar';
import { DeleteForever, Edit } from '@mui/icons-material';
import DeletePostModal from './DeletePostModal';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

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

export default function MeusAnuncios() {
  const { id: userId } = useParams<{ id: string }>();
  const [posts, setPosts] = React.useState([]);
  const [selectedSeller, setSelectedSeller] = React.useState<User | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [isModalOpenDeletion, setIsModalOpenDeletion] = React.useState(false);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    const response = await axios.get(`${apiBaseUrl}/posts/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    return response.data;
  };
  
  const fetchProductImages = async (postId: number) => {
    const response = await axios.get(`${apiBaseUrl}/posts/${postId}/pictures`);
    return response.data;
  };

  const loadPosts = async () => {
    const posts = await fetchPosts();

    const postsWithImages: any = await Promise.all(
      posts.map(async (post: any) => {
        const images = await fetchProductImages(post.id);
        return { ...post, images };
      })
    );

    setPosts(postsWithImages);
  };

  React.useEffect(() => {
    loadPosts()
  }, []);

  const handleDeleteClickDeletion = () => {
    setIsModalOpenDeletion(true);
  };

  const handleCloseModalDeletion = () => {
    setIsModalOpenDeletion(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSeller(null);
  };

  const handleEditPost = (post: any) => {
    navigate(`/anuncio/${post.id}/editar`, { state: { post } });
  };

  const handleConfirmDeletion = async (id: number) => {
    try {
      const response = await axios.delete(`${apiBaseUrl}/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    } catch (error) {
      console.error('Erro ao conectar com a API', error);
    } finally {
      setIsModalOpenDeletion(false);
      await loadPosts();
    }
  };

  const LPtheme = createTheme(getLPTheme('light'));

  return (
    <ThemeProvider theme={LPtheme}>
    <CssBaseline />
    <NavBar/>
    <Box
      id="home"
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
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
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
            Seus&nbsp;
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
              anúncios
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            Aqui estão os equipamentos anunciados por você.
          </Typography>
        </Stack>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
            mt: 4,
          }}
        >
          {posts.length > 0 && posts.map((post: any) => (
            <Card key={post.id} sx={{ maxWidth: 345 }}>
              <ProductSlideShow images={post.images}/>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {post.product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {displayCondition(post.product.condition)}
                </Typography>
              </CardContent>
              <CardActions sx={{justifyContent: 'right'}}>
                <IconButton size="small" onClick={() => handleEditPost(post)}>
                  <Edit />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteClickDeletion()}>
                  <DeleteForever />
                </IconButton>
              </CardActions>
              <DeletePostModal open={isModalOpenDeletion} onClose={handleCloseModalDeletion} onConfirm={() => handleConfirmDeletion(post.id)}/>
            </Card>
          ))}
          {posts.length === 0 && 
              <Typography
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                  width: { sm: '100%', md: '100%' },
                  }}
              >
              Desculpe-nos, não temos anúncios para exibir no momento.
            </Typography>
          }
        </Box>
      </Container>
      {selectedSeller && (
        <SellerInfoModal
          open={modalOpen}
          handleClose={handleCloseModal}
          seller={selectedSeller}
        />
      )}
    </Box>
    <Box sx={{ bgcolor: 'background.default' }}>
      <Footer />
    </Box>
  </ThemeProvider>
  );
}
