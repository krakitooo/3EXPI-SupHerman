import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography, Alert, Stack } from '@mui/material'
import { loginRequest } from '../../api/authApi.js'
import { useAuth } from '../../context/AuthContext.jsx'

function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const { token, user } = await loginRequest(email, password)
            login(token, user)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex' }}>
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '42%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 6,
                }}
            >
                <Typography variant="h4" component="div" fontWeight={600}>
                    SUP Herman
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.85 }}>
                    Gestion des notes de frais
                </Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 3,
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 340 }}>
                    <Typography variant="h6" component="h1" fontWeight={600} gutterBottom>
                        Connexion
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Utilisez les identifiants fournis par votre manager.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                required
                                size="small"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                label="Mot de passe"
                                type="password"
                                fullWidth
                                required
                                size="small"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <Alert severity="error">{error}</Alert>}
                            <Button
                                type="submit"
                                variant="contained"
                                disableElevation
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default LoginPage