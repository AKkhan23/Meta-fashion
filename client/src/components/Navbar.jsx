import { Sparkles, Menu, X } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logoutUser } from '../features/auth/authSlice'

const Navbar = () => {
    const { user } = useSelector(state => state.auth)
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();

    const handleLogout = () => {
        setOpen(false)
        navigate("/")
        dispatch(logoutUser())
    }
    const handleNav = (path) => { setOpen(false); navigate(path) }

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
                    <div className="flex items-center gap-2">
                        {user ? (<>
                            <Link to={user?.isAdmin ? "/admin/dashboard" : "/profile"} className="hidden sm:flex items-center gap-2 text-xs text-charcoal"><span className="w-7 h-7 rounded-full bg-charcoal/10 grid place-items-center text-xs">👤</span> Welcome {user?.name}</Link>
                            <button onClick={handleLogout} className="bg-[#e11d48] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-red-700 cursor-pointer hidden sm:block">Logout</button>
                        </>) : (<Link to={"/login"} className="hidden sm:inline-flex bg-charcoal text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black">Login</Link>)}
                        {/* Toggle button — always visible near logout */}
                        <button onClick={() => setOpen(!open)} className="p-2 rounded-xl border border-charcoal/10 bg-white/60 hover:bg-white transition-colors" aria-label="Toggle menu">
                            {open ? <X className="w-5 h-5 text-charcoal" /> : <Menu className="w-5 h-5 text-charcoal" />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Sidebar drawer */}
            {open && (
                <>
                    <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
                    <div className="fixed top-0 right-0 h-full w-[78%] max-w-[320px] bg-white shadow-2xl z-50 flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b">
                            <span className="font-bold text-charcoal flex items-center gap-2"><Sparkles className="w-5 h-5" /> Meta Fashion</span>
                            <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="flex flex-col gap-1 p-4">
                            {[
                                { label: 'Home', path: '/' },
                                { label: 'Collections', path: '/collections' },
                                { label: 'About', path: '/about' },
                                { label: 'Contact', path: '/contact' },
                                { label: 'Cart', path: '/cart' },
                                { label: 'My Profile', path: '/profile' },
                            ].map(item => (
                                <button key={item.path} onClick={() => handleNav(item.path)} className={`text-left px-4 py-3 rounded-xl text-sm font-medium ${isActive(item.path) ? 'bg-charcoal text-white' : 'hover:bg-gray-100 text-charcoal'}`}>{item.label}</button>
                            ))}
                        </div>
                        <div className="mt-auto p-4 border-t">
                            {user ? <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-[#e11d48] text-white font-semibold">Logout — {user?.name}</button>
                                : <button onClick={() => handleNav('/login')} className="w-full py-3 rounded-xl bg-charcoal text-white font-semibold">Login</button>}
                        </div>
                    </div>
                </>
            )}
        </nav>
    )
}

export default Navbar
