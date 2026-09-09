import { Navigate, Outlet } from 'react-router-dom'
import useAuthStatus from '../hooks/useAuthStatus'
import { LoadingScreen } from './LoadingScreen'

const PublicOnly = () => {
    const { authLoading, isAuthenticated } = useAuthStatus()
    if (authLoading) return <LoadingScreen loadingMessage="Loading..." />
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}
export default PublicOnly
