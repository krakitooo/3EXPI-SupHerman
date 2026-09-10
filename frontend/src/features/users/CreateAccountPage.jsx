import { useState } from 'react'
import { Box, Typography, TextField, MenuItem, Button, Stack, Alert } from '@mui/material'
import { createAccountRequest } from '../../api/usersApi.js'

const ROLES = [
    { value: 'EMPLOYE', label: 'Employé' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'COMPTABILITE', label: 'Comptabilité' },
]

function CreateAccountPage() {
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('EMPLOYE')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [copied, setCopied] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setResult(null)
        setLoading(true)
        try {
            const data = await createAccountRequest(email, role)
            setResult(data)
            setEmail('')
            setRole('EMPLOYE')
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création du compte')
        } finally {
            setLoading(false)
        }
    }

    function handleCopy() {
        navigator.clipboard.writeText(result.inviteLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Box sx={{ maxWidth: 480 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                Créer un compte
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Le compte est créé sans mot de passe. Transmettez le lien généré à la personne concernée pour qu'elle en choisisse un.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="Email"
                        type="email"
                        required
                        size="small"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        select
                        label="Rôle"
                        size="small"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        {ROLES.map((r) => (
                            <MenuItem key={r.value} value={r.value}>
                                {r.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Button type="submit" variant="contained" disableElevation disabled={loading}>
                        {loading ? 'Création...' : 'Créer le compte'}
                    </Button>
                </Stack>
            </Box>

            {result && (
                <Box sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Compte créé pour {result.user.email}
                    </Alert>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Lien d'invitation à transmettre (valable 72h) :
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', mb: 1 }}>
                        {result.inviteLink}
                    </Typography>
                    <Button size="small" onClick={handleCopy}>
                        {copied ? 'Copié !' : 'Copier le lien'}
                    </Button>
                </Box>
            )}
        </Box>
    )
}

export default CreateAccountPage