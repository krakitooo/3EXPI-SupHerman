import { Typography } from '@mui/material'
import { useAuth } from '../../context/AuthContext.jsx'

function MyExpensesPage() {
  const { user } = useAuth()

  return (
    <div>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Mes notes de frais
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Connecté en tant que {user?.email} ({user?.role}). /!\ WIP /!\
      </Typography>
    </div>
  )
}

export default MyExpensesPage