import { useEffect, useState } from 'react'
import { useSearchParams, Link as RouterLink } from 'react-router-dom'
import { Box, Typography, TextField, Button, Alert, Stack, CircularProgress } from '@mui/material'
import { verifyInviteRequest, setPasswordRequest } from '../../api/authApi.js'

function SetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [checking, setChecking] = useState(true)
  const [inviteError, setInviteError] = useState('')
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setInviteError("Lien d'invitation manquant")
      setChecking(false)
      return
    }

    verifyInviteRequest(token)
      .then((data) => {
        setEmail(data.email)
        setChecking(false)
      })
      .catch((err) => {
        setInviteError(err.response?.data?.message || "Lien d'invitation invalide")
        setChecking(false)
      })
  }, [token])

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    if (password.length < 8) {
      setFormError('8 caractères minimum')
      return
    }
    if (password !== confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas')
      return
    }

    setSubmitting(true)
    try {
      await setPasswordRequest(token, password)
      setSuccess(true)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur lors de la définition du mot de passe')
    } finally {
      setSubmitting(false)
    }
  }

  if (checking) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={28} />
      </Box>
    )
  }

  if (inviteError) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
        <Box sx={{ width: '100%', maxWidth: 360 }}>
          <Alert severity="error">{inviteError}</Alert>
        </Box>
      </Box>
    )
  }

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
        <Box sx={{ width: '100%', maxWidth: 360 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Mot de passe défini avec succès.
          </Alert>
          <Button component={RouterLink} to="/login" variant="contained" disableElevation fullWidth>
            Aller à la connexion
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 360 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Choisissez votre mot de passe
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Compte : {email}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Mot de passe"
              type="password"
              required
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Confirmer le mot de passe"
              type="password"
              required
              size="small"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {formError && <Alert severity="error">{formError}</Alert>}
            <Button type="submit" variant="contained" disableElevation disabled={submitting}>
              {submitting ? 'Enregistrement...' : 'Valider'}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default SetPasswordPage