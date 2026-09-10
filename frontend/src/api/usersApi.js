import axiosClient from './axiosClient.js'

export function createAccountRequest(email, role) {
  return axiosClient.post('/users', { email, role }).then((res) => res.data)
}