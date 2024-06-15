import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 10,
  p: 4,
  borderRadius: 2,
};

interface Seller {
    name: string;
    phone: string;
    email: string;
  }

interface SellerInfoModalProps {
    open: boolean;
    handleClose: () => void;
    seller: Seller;
}

const SellerInfoModal: React.FC<SellerInfoModalProps>  = ({ open, handleClose, seller }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="seller-info-title"
      aria-describedby="seller-info-description"
    >
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography id="seller-info-title" variant="h6" component="h2">
            Informações do anunciante
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ marginRight: 1 }}/> {seller.name}
          </Typography>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ marginRight: 1 }}/> {seller.phone}
          </Typography>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon sx={{ marginRight: 1 }}/> {seller.email}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default SellerInfoModal;
