import { Navigate, useLocation } from 'react-router-dom'
import { useResellerAuth } from '../../context/ResellerAuthContext'

export function ResellerGuard({ children }: { children: React.ReactNode }) {
  const { session } = useResellerAuth()
  const location = useLocation()

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
