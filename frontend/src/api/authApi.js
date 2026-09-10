import axiosClient from './axiosClient.js'

export function loginRequest(email, password) {
  return axiosClient.post('/auth/login', { email, password }).then((res) => res.data)
}