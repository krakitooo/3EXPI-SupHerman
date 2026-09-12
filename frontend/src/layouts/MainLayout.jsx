import { useState } from 'react'
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Divider,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { setAuthToken } from '../api/axiosClient.js'

function MainLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)

    function handleLogout() {
        setAuthToken(null)
        logout()
    }

    function handleMenuNavigate(path) {
        setAnchorEl(null)
        navigate(path)
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
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component={RouterLink}
                        to="/"
                        sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
                    >
                        SUP Herman
                    </Typography>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
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
                            >
                                Inviter un employé
                            </Button>
                        )}
                        <Button
                            component={RouterLink}
                            to="/profile"
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            {user?.email} · {user?.role}
                        </Button>
                        <Button onClick={handleLogout} size="small">
                            Déconnexion
                        </Button>
                    </Box>

                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <MenuIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                            <MenuItem disabled sx={{ opacity: '1 !important' }}>
                                {user?.email} · {user?.role}
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => handleMenuNavigate('/')}>Mes notes de frais</MenuItem>
                            <MenuItem onClick={() => handleMenuNavigate('/profile')}>Mon profil</MenuItem>
                            {['MANAGER', 'COMPTABILITE'].includes(user?.role) && (
                                <MenuItem onClick={() => handleMenuNavigate('/expenses/all')}>
                                    Toutes les notes
                                </MenuItem>
                            )}
                            {user?.role === 'MANAGER' && (
                                <MenuItem onClick={() => handleMenuNavigate('/create-account')}>
                                    Inviter un employé
                                </MenuItem>
                            )}
                            <Divider />
                            <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default MainLayout