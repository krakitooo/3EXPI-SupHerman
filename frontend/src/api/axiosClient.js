import axios from 'axios'

const axiosClient = axios.create({
  baseURL: '/api',
})

export function setAuthToken(token) {
  if (token) {
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete axiosClient.defaults.headers.common.Authorization
  }
}

export default axiosClient