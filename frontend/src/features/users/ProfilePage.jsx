import { Box, Typography, Stack } from '@mui/material'
import { useAuth } from '../../context/AuthContext.jsx'

const ROLE_LABELS = {
  EMPLOYE: 'Employé',
  MANAGER: 'Manager',
  COMPTABILITE: 'Comptabilité',
}

function ProfilePage() {
  const { user } = useAuth()

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Mon profil
      </Typography>

      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body1">{user?.email}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Rôle
          </Typography>
          <Typography variant="body1">{ROLE_LABELS[user?.role] || user?.role}</Typography>
        </Box>
      </Stack>
    </Box>
  )
}

export default ProfilePage