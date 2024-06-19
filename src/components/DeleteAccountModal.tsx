import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }

const DeleteAccountModal: React.FC<DeleteConfirmationModalProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Deleção</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tem certeza que encerrar sua conta?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error">
          Deletar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountModal;