import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import { Outlet, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { setAuthToken } from '../api/axiosClient.js'

function MainLayout() {
    const { user, logout } = useAuth()

    function handleLogout() {
        setAuthToken(null)
        logout()
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            >
                <Toolbar sx={{ gap: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ flexGrow: 1 }}>
                        SUP Herman - Notes de frais
                    </Typography>

                    {['MANAGER', 'COMPTABILITE'].includes(user?.role) && (
                        <Button component={RouterLink} to="/expenses/all" size="small">
                            Toutes les notes
                        </Button>
                    )}

                    {user?.role === 'MANAGER' && (
                        <Button
                            component={RouterLink}
                            to="/create-account"
                            size="small"
                            variant="outlined"
                            startIcon={<PersonAddAltIcon fontSize="small" />}
                            sx={{ mr: 1 }}
                        >
                            Inviter un employé
                        </Button>
                    )}

                    <Typography variant="body2" color="text.secondary">
                        {user?.email} · {user?.role}
                    </Typography>
                    <Button onClick={handleLogout} size="small">
                        Déconnexion
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default MainLayout