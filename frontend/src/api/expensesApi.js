import axiosClient from './axiosClient.js'

export function createExpenseRequest(title, comment, files) {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('comment', comment)
    files.forEach((file) => formData.append('attachments', file))

    return axiosClient.post('/expenses', formData).then((res) => res.data)
}

export function getMyExpensesRequest() {
    return axiosClient.get('/expenses/mine').then((res) => res.data)
}

export function getExpenseByIdRequest(id) {
    return axiosClient.get(`/expenses/${id}`).then((res) => res.data)
}

export async function downloadAttachmentRequest(expenseId, attachmentId, filename) {
    const response = await axiosClient.get(`/expenses/${expenseId}/attachments/${attachmentId}`, {
        responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}

export function getAllExpensesRequest() {
    return axiosClient.get('/expenses/all').then((res) => res.data)
}

export function updateExpenseStatusRequest(id, status) {
    return axiosClient.patch(`/expenses/${id}/status`, { status }).then((res) => res.data)
}