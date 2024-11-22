import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Box, TextField, Button, Typography, MenuItem, Modal, Alert } from '@mui/material';

const CreateNoteForm = ({ onNoteCreated, onOpenAuthorModal, onOpenCategoryModal }) => {
    const [note, setNote] = useState({
        titre: '',
        contenu: '',
        auteurId: '',
        categorieId: '',
    });
    const [auteurs, setAuteurs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

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

    useEffect(() => {
        fetchAuteurs();
        fetchCategories();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNote({ ...note, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);
    
        try {
            // Préparer les données dans le format attendu par l'API
            const requestData = {
                titre: note.titre,
                contenu: note.contenu,
                auteur: { id: note.auteurId }, // Ajouter l'auteur avec l'ID sélectionné
                categorie: { id: note.categorieId }, // Ajouter la catégorie avec l'ID sélectionné
            };
    
            // Envoyer les données à l'API
            await axiosInstance.post('/notes', requestData);
    
            // Succès : Réinitialiser le formulaire
            setSuccess(true);
            setNote({ titre: '', contenu: '', auteurId: '', categorieId: '' });
            onNoteCreated(); // Rafraîchir la liste des notes
        } catch (error) {
            // Gestion des erreurs
            setError(error.response?.data?.message || 'Erreur inconnue');
            console.error('Erreur lors de la création de la note:', error);
            console.log(note); // Affiche l'état actuel des données pour débogage
        }
    };    

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}
        >
            <Typography variant="h5" gutterBottom color='black'>
                Ajouter une nouvelle Note
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Note créée avec succès !</Alert>}

            <TextField
                label="Titre"
                name="titre"
                value={note.titre}
                onChange={handleChange}
                required
                fullWidth
            />
            <TextField
                label="Contenu"
                name="contenu"
                value={note.contenu}
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
                value={note.auteurId}
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
            <Button onClick={onOpenAuthorModal} variant="outlined" color="primary">
                Ajouter un auteur
            </Button>
            <TextField
                select
                label="Catégorie"
                name="categorieId"
                value={note.categorieId}
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
            <Button onClick={onOpenCategoryModal} variant="outlined" color="primary">
                Ajouter une catégorie
            </Button>
            <Button type="submit" variant="contained" color="primary">
                Ajouter la note
            </Button>
        </Box>
    );
};

export default CreateNoteForm;