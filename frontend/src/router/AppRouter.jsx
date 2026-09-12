import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../features/auth/LoginPage.jsx'
import SetPasswordPage from '../features/auth/SetPasswordPage.jsx'
import CreateAccountPage from '../features/users/CreateAccountPage.jsx'
import MyExpensesPage from '../features/expenses/MyExpensesPage.jsx'
import CreateExpensePage from '../features/expenses/CreateExpensePage.jsx'
import AllExpensesPage from '../features/expenses/AllExpensesPage.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import MainLayout from '../layouts/MainLayout.jsx'

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/set-password" element={<SetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<MyExpensesPage />} />
          <Route path="/expenses/new" element={<CreateExpensePage />} />

          <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'COMPTABILITE']} />}>
            <Route path="/expenses/all" element={<AllExpensesPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
            <Route path="/create-account" element={<CreateAccountPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter