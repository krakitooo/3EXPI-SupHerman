import { Chip } from '@mui/material'

const STATUS_CONFIG = {
    CREEE: { label: 'Créée', color: 'default' },
    VALIDEE: { label: 'Validée', color: 'success' },
    REFUSEE: { label: 'Refusée', color: 'error' },
    TRAITEE: { label: 'Traitée', color: 'info' },
}

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || { label: status, color: 'default' }
    return <Chip label={config.label} color={config.color} size="small" />
}

export default StatusBadge