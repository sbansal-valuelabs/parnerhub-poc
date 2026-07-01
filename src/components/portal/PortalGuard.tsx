import { Navigate, useLocation } from 'react-router-dom'
import { usePortalAuth } from '../../context/PortalAuthContext'

export function PortalGuard({ children }: { children: React.ReactNode }) {
  const { session } = usePortalAuth()
  const location = useLocation()

  if (!session) {
    return <Navigate to="/portal/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
