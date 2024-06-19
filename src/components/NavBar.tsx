import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SharehubIcon from './SharehubIcon';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserIdFromToken, getUserNameFromToken, getUserTypeFromToken, isUserLoggedIn } from './utils/getToken';
import { Menu } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

export default function NavBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };

  const handlePosts = () => {
    location.pathname === '/' ? scrollToSection('home') : navigate(`/`);
  };

  const handleLogin = () => {
    navigate(`/login`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate(`/`);
  };

  const handleListasMaterial = () => {
    navigate(`/listas-material`);
  };

  const handleMeusAnuncios = (userId: number | null) => {
    navigate(`/anuncios/usuario/${userId}`);
  };

  const handleAnunciar = () => {
    if (!isUserLoggedIn()) {
      navigate(`/login`);
    } else {
      if (getUserTypeFromToken() === 'STUDENT') {
        navigate(`/anunciar`);
      } else {
        navigate(`/criar-lista-material`);
      }
    }
  };

  const handleViewUser = (userId: number | null) => {
    navigate(`/cadastro/${userId}`);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ boxShadow: 0, bgcolor: 'transparent', backgroundImage: 'none', mt: 2 }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            borderRadius: '999px',
            backdropFilter: 'blur(24px)',
            maxHeight: 40,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'hsla(220, 60%, 99%, 0.6)',
            boxShadow:
              '0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px hsla(210, 100%, 80%, 0.5)',
            ...theme.applyStyles('dark', {
              bgcolor: 'hsla(220, 0%, 0%, 0.7)',
              boxShadow:
                '0 1px 2px hsla(210, 0%, 0%, 0.5), 0 2px 12px hsla(210, 100%, 25%, 0.3)',
            }),
          })}
        >
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <SharehubIcon/>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => handlePosts()}
              >
                Produtos
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => handleListasMaterial()}
              >
                Listas de material
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 0.5,
              alignItems: 'center',
            }}
          >
            {!isUserLoggedIn() && <Button color="primary" variant="text" size="small" onClick={() => handleLogin()}>
              Acessar conta
            </Button>}
            <Button color="primary" variant="contained" size="small" onClick={() => handleAnunciar()}>
              {getUserTypeFromToken() === 'STUDENT' || localStorage.getItem ('accessToken') === null ? 'Anunciar' : 'Cadastrar lista'}
            </Button>
            {isUserLoggedIn() && <MenuItem>
                  <Button color="primary" variant="text" fullWidth sx={{ border: '1px solid' }} onClick={handleUserMenuOpen}>
                  {getUserNameFromToken()}
                  <KeyboardArrowDown />
                  </Button>
                  <Menu
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                  >
                    <MenuItem onClick={() => handleViewUser(getUserIdFromToken())}>Meu cadastro</MenuItem>
                    <MenuItem onClick={() => handleMeusAnuncios(getUserIdFromToken())}>Meus anúncios</MenuItem>
                    <MenuItem onClick={() => handleLogout()}>Sair</MenuItem>
                  </Menu>
            </MenuItem>}
          </Box>
          <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ my: 3 }} />
                <MenuItem onClick={() => scrollToSection('posts')}>
                  Features
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('testimonials')}>
                  Testimonials
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('highlights')}>
                  Highlights
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('pricing')}>
                  Pricing
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('faq')}>FAQ</MenuItem>
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign upp
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
