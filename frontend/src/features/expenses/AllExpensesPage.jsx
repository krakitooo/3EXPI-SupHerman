import { useEffect, useState } from 'react'
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    CircularProgress,
    Button,
    Stack,
} from '@mui/material'
import StatusBadge from '../../components/StatusBadge.jsx'
import ExpenseDetailModal from '../../components/ExpenseDetailModal.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getAllExpensesRequest, updateExpenseStatusRequest } from '../../api/expensesApi.js'

function AllExpensesPage() {
    const { user } = useAuth()
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedId, setSelectedId] = useState(null)
    const [pendingAction, setPendingAction] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [actionError, setActionError] = useState('')

    function loadExpenses() {
        setLoading(true)
        getAllExpensesRequest()
            .then((data) => setExpenses(data))
            .catch((err) => setError(err.response?.data?.message || 'Erreur de chargement'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadExpenses()
    }, [])

    function askConfirm(expense, status, label) {
        setActionError('')
        setPendingAction({ expenseId: expense.id, status, label })
    }

    async function handleConfirm() {
        setActionLoading(true)
        setActionError('')
        try {
            await updateExpenseStatusRequest(pendingAction.expenseId, pendingAction.status)
            setPendingAction(null)
            loadExpenses()
        } catch (err) {
            setActionError(err.response?.data?.message || "Erreur lors de la mise à jour du statut")
        } finally {
            setActionLoading(false)
        }
    }

    function renderActions(expense) {
        if (user.role === 'MANAGER' && expense.status === 'CREEE' && expense.userId !== user.id) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={(e) => {
                            e.stopPropagation()
                            askConfirm(expense, 'VALIDEE', 'Valider')
                        }}
                    >
                        Valider
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={(e) => {
                            e.stopPropagation()
                            askConfirm(expense, 'REFUSEE', 'Refuser')
                        }}
                    >
                        Refuser
                    </Button>
                </Stack>
            )
        }

        if (user.role === 'COMPTABILITE' && expense.status === 'VALIDEE') {
            return (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                        e.stopPropagation()
                        askConfirm(expense, 'TRAITEE', 'Marquer comme traitée')
                    }}
                >
                    Marquer comme traitée
                </Button>
            )
        }

        return (
            <Typography variant="body2" color="text.disabled">
                -
            </Typography>
        )
    }

    return (
        <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Toutes les notes de frais
            </Typography>

            {loading && <CircularProgress size={28} />}
            {!loading && error && <Typography color="error">{error}</Typography>}

            {!loading && !error && expenses.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                    Aucune note de frais à afficher.
                </Typography>
            )}

            {!loading && !error && expenses.length > 0 && (
                <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Titre</TableCell>
                                <TableCell>Employé</TableCell>
                                <TableCell>Statut</TableCell>
                                <TableCell>Date de soumission</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow
                                    key={expense.id}
                                    hover
                                    onClick={() => setSelectedId(expense.id)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>{expense.title}</TableCell>
                                    <TableCell>{expense.user?.email}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={expense.status} />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(expense.submissionDate).toLocaleDateString('fr-FR')}
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        {renderActions(expense)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}

            <ExpenseDetailModal
                expenseId={selectedId}
                open={Boolean(selectedId)}
                onClose={() => setSelectedId(null)}
            />

            <ConfirmDialog
                open={Boolean(pendingAction)}
                title={pendingAction?.label}
                message={
                    actionError ||
                    `Voulez-vous vraiment ${pendingAction?.label.toLowerCase()} cette note de frais ?`
                }
                confirmLabel={pendingAction?.label}
                confirmColor={pendingAction?.status === 'REFUSEE' ? 'error' : 'primary'}
                onConfirm={handleConfirm}
                onCancel={() => setPendingAction(null)}
                loading={actionLoading}
            />
        </Box>
    )
}

export default AllExpensesPage