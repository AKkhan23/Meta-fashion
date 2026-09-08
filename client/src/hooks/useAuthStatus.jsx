import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"


const useAuthStatus = () => {

    const { user } = useSelector(state => state.auth)

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {

        user ? setIsAuthenticated(true) : setIsAuthenticated(false)
        setAuthLoading(false)

    }, [user])


    return { isAuthenticated, authLoading }



}

export default useAuthStatus
