import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../api/axiosInstance';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const NotesDataGrid = ({ refresh, onEdit }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/notes');
            const formattedNotes = response.data.map((note) => ({
                ...note,
                auteurName: note.auteur?.nom || 'Non défini',
                auteurId: note.auteur?.id || null, // Ajout de l'ID de l'auteur
                categorieName: note.categorie?.nom || 'Non défini',
                categorieId: note.categorie?.id || null, // Ajout de l'ID de la catégorie
            }));
            setNotes(formattedNotes);
        } catch (error) {
            console.error('Erreur lors de la récupération des notes:', error);
        } finally {
            setLoading(false);
        }
    };    

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/notes/${id}`);
            setNotes(notes.filter((note) => note.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression de la note:', error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [refresh]);

    const columns = [
        { field: 'titre', headerName: 'Titre', width: 200 },
        {
            field: 'contenu',
            headerName: 'Contenu',
            width: 300,
            renderCell: (params) => (
                <Typography variant="body2" noWrap>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'auteurName',
            headerName: 'Auteur',
            width: 150,
        },
        {
            field: 'categorieName',
            headerName: 'Catégorie',
            width: 150,
        },
        {
            field: 'dateCreation',
            headerName: 'Date de Création',
            width: 180,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        color="primary"
                        onClick={() => onEdit(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ height: 500, width: '100%', marginTop: 4 }}>
            <Typography variant="h4" gutterBottom color='black'>
                Liste des Notes
            </Typography>
            <DataGrid
                rows={notes}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                loading={loading}
                getRowId={(row) => row.id}
                sx={{
                    backgroundColor: '#fff',
                    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                }}
            />
        </Box>
    );
};

export default NotesDataGrid;