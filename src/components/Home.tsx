import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent } from '@mui/material';
import axios from 'axios';
import SellerInfoModal from './SellerInfoModal';
import { useNavigate } from 'react-router-dom';
import { displayCondition } from './utils/displayCondition';
import ProductSlideShow from './PicturesSlide';

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

const fetchPosts = async () => {
  const response = await axios.get(`${apiBaseUrl}/posts`);
  return response.data;
};

const fetchProductImages = async (postId: number) => {
  const response = await axios.get(`${apiBaseUrl}/posts/${postId}/pictures`);
  return response.data;
};

export default function Home() {
  const [posts, setPosts] = React.useState([]);
  const [selectedSeller, setSelectedSeller] = React.useState<User | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const getPosts = async () => {
      const posts = await fetchPosts();

      const postsWithImages: any = await Promise.all(
        posts.map(async (post: any) => {
          const images = await fetchProductImages(post.id);
          return { ...post, images };
        })
      );

      setPosts(postsWithImages);
    };

    getPosts();
  }, []);

  const handleOpenModal = (seller: User) => {
    setSelectedSeller(seller);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSeller(null);
  };

  const handleViewMore = (post: any) => {
    navigate(`/anuncio/${post.id}`, { state: { post } });
  };

  return (
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
            Equipamentos&nbsp;
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
              anunciados
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            Explore equipamentos anunciados pelos próprios alunos do curso de medicina da Universidade Católica de Brasília
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
            <Card key={post.id} sx={{ width: 345 }}>
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
              <CardActions>
                <Button size="small" onClick={() => handleViewMore(post)}>Ver mais</Button>
                <Button size="small" onClick={() => handleOpenModal(post.user)}>Comprar</Button>
              </CardActions>
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
  );
}
