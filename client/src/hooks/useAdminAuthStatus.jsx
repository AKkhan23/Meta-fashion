import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"


const useAdminAuthStatus = () => {

    const { user } = useSelector(state => state.auth)

    const [isAdmin, setIsAdmin] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {

        user?.isAdmin ? setIsAdmin(true) : setIsAdmin(false)
        setAuthLoading(false)

    }, [user])


    return { isAdmin, authLoading }



}

export default useAdminAuthStatus
