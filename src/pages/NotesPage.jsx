import React, { useState } from 'react';
import CreateNoteForm from '../components/CreateNoteForm';
import EditNoteForm from '../components/EditNoteForm';
import ModalForm from '../components/ModalForm';
import NotesDataGrid from '../components/NotesDataGrid';
import { Box, Grid, Typography, Modal } from '@mui/material';

const NotesPage = () => {
    const [isAuthorModalOpen, setAuthorModalOpen] = useState(false);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState(null);
    const [refreshNotes, setRefreshNotes] = useState(false);

    const handleNoteCreated = () => {
        setRefreshNotes((prev) => !prev);
    };

    const handleEditClick = (note) => {
        setNoteToEdit(note);
        setEditModalOpen(true);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 4,
                padding: 4,
                backgroundColor: '#f9f9f9',
                minHeight: '100vh',
                alignItems: 'center', // Center elements horizontally
                justifyContent: 'center', // Center elements vertically
            }}
        >
            <Typography variant="h4" mb={4} textAlign="center" color='black'>
                Gestion des Notes
            </Typography>

            <Grid container spacing={4} md={11}>
                <Grid item xs={12} md={3}>
                    <CreateNoteForm
                        onNoteCreated={handleNoteCreated}
                        onOpenAuthorModal={() => setAuthorModalOpen(true)}
                        onOpenCategoryModal={() => setCategoryModalOpen(true)}
                    />
                </Grid>
                <Grid item xs={12} md={9}>
                    <NotesDataGrid
                        refresh={refreshNotes}
                        onEdit={handleEditClick}
                    />
                </Grid>
            </Grid>

            <Modal open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
                <EditNoteForm
                    noteToEdit={noteToEdit}
                    onClose={() => setEditModalOpen(false)}
                    onUpdate={handleNoteCreated}
                />
            </Modal>

            <ModalForm
                open={isAuthorModalOpen}
                onClose={() => setAuthorModalOpen(false)}
                endpoint="/auteurs"
                title="Ajouter un Auteur"
                fieldName="auteur"
                onCreated={handleNoteCreated}
                titleColor="black"
            />
            <ModalForm
                open={isCategoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                endpoint="/categories"
                title="Ajouter une Catégorie"
                fieldName="catégorie"
                onCreated={handleNoteCreated}
                titleColor="black"
            />
        </Box>
    );
};

export default NotesPage;