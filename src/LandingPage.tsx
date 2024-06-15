import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Footer from './components/Footer';
import getLPTheme from './getLPTheme';
import PerguntasFrequentes from './components/PerguntasFrequentes';

export default function LandingPage() {
  const LPtheme = createTheme(getLPTheme('light'));

  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <NavBar/>
      <Home />
      <Box sx={{ bgcolor: 'background.default' }}>
        <Divider />
        <PerguntasFrequentes />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
