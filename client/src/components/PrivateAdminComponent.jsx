import React from 'react'
import useAdminAuthStatus from '../hooks/useAdminAuthStatus'
import { LoadingScreen } from './LoadingScreen'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateAdminComponent = () => {

    const { authLoading, isAdmin } = useAdminAuthStatus()


    if (authLoading) {
        return (
            <LoadingScreen loadingMessage={"Checking If You are Authorised..."} />
        )
    }

    return isAdmin ? <Outlet /> : <Navigate to={"/profile"} />

}

export default PrivateAdminComponent
