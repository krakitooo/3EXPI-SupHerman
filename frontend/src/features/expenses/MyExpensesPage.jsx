import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import StatusBadge from '../../components/StatusBadge.jsx'
import ExpenseDetailModal from '../../components/ExpenseDetailModal.jsx'
import { getMyExpensesRequest } from '../../api/expensesApi.js'

function MyExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    setLoading(true)
    getMyExpensesRequest()
      .then((data) => setExpenses(data))
      .catch((err) => setError(err.response?.data?.message || 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Mes notes de frais
        </Typography>
        <Button
          component={RouterLink}
          to="/expenses/new"
          variant="contained"
          disableElevation
          startIcon={<AddIcon fontSize="small" />}
        >
          Nouvelle note
        </Button>
      </Box>

      {loading && <CircularProgress size={28} />}
      {!loading && error && <Typography color="error">{error}</Typography>}

      {!loading && !error && expenses.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Aucune note de frais pour le moment.
        </Typography>
      )}

      {!loading && !error && expenses.length > 0 && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date de soumission</TableCell>
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
                <TableCell>
                  <StatusBadge status={expense.status} />
                </TableCell>
                <TableCell>
                  {new Date(expense.submissionDate).toLocaleDateString('fr-FR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ExpenseDetailModal
        expenseId={selectedId}
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
      />
    </Box>
  )
}

export default MyExpensesPage