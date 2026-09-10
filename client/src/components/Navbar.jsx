import { Sparkles } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logoutUser } from '../features/auth/authSlice'

const Navbar = () => {

    const { user } = useSelector(state => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();


    const handleLogout = () => {
        navigate("/")
        dispatch(logoutUser())
    }

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/"
        return location.pathname === path || location.pathname.startsWith(path + "/")
    }
    const navLink = (path) => isActive(path)
        ? "text-charcoal border-b border-charcoal pb-1 text-xs tracking-[0.14em] uppercase font-medium"
        : "text-charcoal/70 hover:text-charcoal text-xs tracking-[0.14em] uppercase"
    return (
        <nav className={location?.pathname.includes("admin") ? "hidden" : "bg-[#E8E1D9] border-b border-charcoal/10 sticky top-0 z-50"}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to={"/"}>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-charcoal" />
                            <span className="text-xl font-bold text-charcoal">Meta Fashion</span>
                        </div>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className={navLink("/")}>HOME</Link>
                        <Link to="/collections" className={navLink("/collections")}>COLLECTIONS</Link>
                        <Link to="/about" className={navLink("/about")}>ABOUT</Link>
                        <Link to="/contact" className={navLink("/contact")}>CONTACT</Link>
                    </div>
                    {
                        user ? (<>
                            <div className='flex items-center justify-center space-x-4'>
                                <Link to={user?.isAdmin ? "/admin/dashboard" : "/profile"} className="hidden sm:flex items-center gap-2 text-xs text-charcoal"><span className="w-7 h-7 rounded-full bg-charcoal/10 grid place-items-center text-xs">👤</span> Welcome {user?.name}</Link>
                                <button onClick={handleLogout} className="bg-[#e11d48] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-red-700 cursor-pointer">Logout</button>
                            </div>
                        </>) : (<Link to={"/login"} className="bg-charcoal text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black">
                            Login
                        </Link>)
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar
