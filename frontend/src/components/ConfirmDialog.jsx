import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

function ConfirmDialog({ open, title, message, confirmLabel, confirmColor = 'primary', onConfirm, onCancel, loading }) {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} disabled={loading}>
                    Annuler
                </Button>
                <Button onClick={onConfirm} variant="contained" color={confirmColor} disableElevation disabled={loading}>
                    {loading ? '...' : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog