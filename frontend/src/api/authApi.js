import axiosClient from './axiosClient.js'

export function loginRequest(email, password) {
  return axiosClient.post('/auth/login', { email, password }).then((res) => res.data)
}

export function verifyInviteRequest(token) {
  return axiosClient.get(`/auth/invite/${token}`).then((res) => res.data)
}

export function setPasswordRequest(token, password) {
  return axiosClient.post('/auth/set-password', { token, password }).then((res) => res.data)
}