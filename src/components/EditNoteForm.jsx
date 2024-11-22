import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, MenuItem } from '@mui/material';
import axiosInstance from '../api/axiosInstance';

const EditNoteForm = ({ noteToEdit, onClose, onUpdate }) => {
    const [note, setNote] = useState({ ...noteToEdit });
    const [auteurs, setAuteurs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setNote({ ...noteToEdit }); // Synchronise le formulaire avec les données à modifier
        fetchAuteurs();
        fetchCategories();
    }, [noteToEdit]);

    const fetchAuteurs = async () => {
        try {
            const response = await axiosInstance.get('/auteurs');
            setAuteurs(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des auteurs:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNote({ ...note, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);
        try {
            const requestData = {
                titre: note.titre,
                contenu: note.contenu,
                auteur: { id: note.auteurId },
                categorie: { id: note.categorieId },
            };

            await axiosInstance.put(`/notes/${note.id}`, requestData);
            setSuccess(true);
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la note:', error);
            setError(error.response?.data?.message || 'Erreur inconnue');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: 2,
                maxWidth: 600,
                margin: '0 auto',
                boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                backgroundColor: '#fff',
            }}
        >
            <Typography variant="h5" gutterBottom>
                Modifier une note
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Note mise à jour avec succès !</Alert>}

            <TextField
                label="Titre"
                name="titre"
                value={note.titre || ''}
                onChange={handleChange}
                required
                fullWidth
            />
            <TextField
                label="Contenu"
                name="contenu"
                value={note.contenu || ''}
                onChange={handleChange}
                multiline
                rows={4}
                required
                fullWidth
            />
            <TextField
                select
                label="Auteur"
                name="auteurId"
                value={note.auteurId || ''}
                onChange={handleChange}
                required
                fullWidth
            >
                {auteurs.map((auteur) => (
                    <MenuItem key={auteur.id} value={auteur.id}>
                        {auteur.nom}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Catégorie"
                name="categorieId"
                value={note.categorieId || ''}
                onChange={handleChange}
                required
                fullWidth
            >
                {categories.map((categorie) => (
                    <MenuItem key={categorie.id} value={categorie.id}>
                        {categorie.nom}
                    </MenuItem>
                ))}
            </TextField>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" color="primary" type="submit">
                    Enregistrer
                </Button>
                <Button variant="outlined" color="secondary" onClick={onClose}>
                    Annuler
                </Button>
            </Box>
        </Box>
    );
};

export default EditNoteForm;