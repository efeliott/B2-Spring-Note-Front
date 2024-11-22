import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Alert } from '@mui/material';
import axiosInstance from '../api/axiosInstance';

const ModalForm = ({ open, onClose, endpoint, title, fieldName, onCreated }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setError(null);
        setSuccess(false);
        try {
            await axiosInstance.post(endpoint, { nom: name });
            setSuccess(true);
            setName('');
            onCreated(); // Rafraîchit les listes des auteurs ou catégories
        } catch (error) {
            setError(error.response?.data?.message || 'Erreur inconnue');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" mb={2}>
                    {title}
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{`${fieldName} ajouté avec succès !`}</Alert>}
                <TextField
                    label={`Nom du ${fieldName}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                />
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    fullWidth
                >
                    Ajouter
                </Button>
            </Box>
        </Modal>
    );
};

export default ModalForm;