import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Button, Stack, Alert } from '@mui/material'
import { createExpenseRequest } from '../../api/expensesApi.js'

function CreateExpensePage() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [comment, setComment] = useState('')
    const [files, setFiles] = useState([])
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    function handleFileChange(e) {
        setFiles(Array.from(e.target.files))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            await createExpenseRequest(title, comment, files)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création de la note')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Box sx={{ maxWidth: 480 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                Nouvelle note de frais
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    <TextField
                        label="Titre"
                        required
                        size="small"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Commentaire"
                        multiline
                        minRows={3}
                        size="small"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Pièces justificatives (PDF, JPEG ou PNG, 5 Mo max par fichier)
                        </Typography>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                        />
                    </Box>

                    {error && <Alert severity="error">{error}</Alert>}

                    <Button type="submit" variant="contained" disableElevation disabled={submitting}>
                        {submitting ? 'Envoi...' : 'Soumettre la note'}
                    </Button>
                </Stack>
            </Box>
        </Box>
    )
}

export default CreateExpensePage