import { LoadingScreen } from './LoadingScreen'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStatus from '../hooks/useAuthStatus'

const PrivateComponent = () => {

    const { authLoading, isAuthenticated } = useAuthStatus()


    if (authLoading) {
        return (
            <LoadingScreen loadingMessage={"Checking If You are Authorised..."} />
        )
    }

    return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />

}

export default PrivateComponent
