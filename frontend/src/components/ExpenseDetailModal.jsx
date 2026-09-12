import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import StatusBadge from './StatusBadge.jsx'
import { getExpenseByIdRequest, downloadAttachmentRequest } from '../api/expensesApi.js'

function ExpenseDetailModal({ expenseId, open, onClose }) {
    const [expense, setExpense] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!open || !expenseId) return

        setLoading(true)
        setError('')
        getExpenseByIdRequest(expenseId)
            .then((data) => setExpense(data))
            .catch((err) => setError(err.response?.data?.message || 'Erreur de chargement'))
            .finally(() => setLoading(false))
    }, [open, expenseId])

    function handleDownload(attachment) {
        downloadAttachmentRequest(expenseId, attachment.id, attachment.originalName)
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Détail de la note de frais</DialogTitle>
            <DialogContent dividers>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <CircularProgress size={28} />
                    </Box>
                )}

                {!loading && error && <Typography color="error">{error}</Typography>}

                {!loading && expense && (
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">Titre</Typography>
                            <Typography variant="body1">{expense.title}</Typography>
                        </Box>

                        {expense.user?.email && (
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Employé</Typography>
                                <Typography variant="body1">{expense.user.email}</Typography>
                            </Box>
                        )}

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">Statut</Typography>
                            <StatusBadge status={expense.status} />
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">Date de soumission</Typography>
                            <Typography variant="body1">
                                {new Date(expense.submissionDate).toLocaleDateString('fr-FR')}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">Commentaire</Typography>
                            <Typography variant="body1">{expense.comment || '-'}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Pièces justificatives
                            </Typography>
                            {expense.attachments?.length ? (
                                <List dense disablePadding>
                                    {expense.attachments.map((attachment) => (
                                        <ListItem
                                            key={attachment.id}
                                            disableGutters
                                            secondaryAction={
                                                <IconButton edge="end" onClick={() => handleDownload(attachment)}>
                                                    <DownloadIcon fontSize="small" />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={attachment.originalName}
                                                secondary={`${(attachment.size / 1024).toFixed(0)} Ko`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Aucune pièce jointe
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ExpenseDetailModal