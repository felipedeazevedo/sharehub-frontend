import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage'; // Importe o componente da página inicial aqui
import ProductDetail from './components/ProductDetail';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import NewPost from './components/NewPost';
import UserProfile from './components/UserProfile';
import MeusAnuncios from './components/MeusAnuncios';
import EditPost from './components/EditPost';
import NewMaterialList from './components/NewMaterialList';
import MaterialListView from './components/MaterialListView';
import MaterialListTable from './components/MaterialListTable';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/anuncio/:id" element={<ProductDetail />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/cadastro" element={<SignUp />} />
        <Route path="/redefinir-senha" element={<ForgotPassword />} />
        <Route path="/anunciar" element={<NewPost />} />
        <Route path="/cadastro/:id" element={<UserProfile />} />
        <Route path="/anuncios/usuario/:id" element={<MeusAnuncios />} />
        <Route path="/anuncio/:id/editar" element={<EditPost />} />
        <Route path="/criar-lista-material" element={<NewMaterialList />} />
        <Route path="/listas-material/:id" element={<MaterialListView />} />
        <Route path="/listas-material" element={<MaterialListTable />} />
      </Routes>
    </Router>
  );
};

export default App;
