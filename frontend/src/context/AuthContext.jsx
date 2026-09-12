import { createContext, useContext, useState } from 'react'
import { setAuthToken } from '../api/axiosClient.js'

const AuthContext = createContext(null)

function loadStoredAuth() {
  try {
    const token = localStorage.getItem('token')
    const userRaw = localStorage.getItem('user')
    if (!token || !userRaw) return { token: null, user: null }
    return { token, user: JSON.parse(userRaw) }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const [{ token, user }, setAuthState] = useState(() => {
    const stored = loadStoredAuth()
    if (stored.token) {
      setAuthToken(stored.token)
    }
    return stored
  })

  function login(newToken, newUser) {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setAuthToken(newToken)
    setAuthState({ token: newToken, user: newUser })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthToken(null)
    setAuthState({ token: null, user: null })
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}