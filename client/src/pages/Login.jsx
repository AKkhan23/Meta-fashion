import { Sparkles, Upload, Shirt, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import { loginUser } from '../features/auth/authSlice';

function Login() {
    const { isLoading, isError, message, user } = useSelector(state => state.auth)
    const [formData, setFormData] = useState({ email: "", password: "" })
    const { email, password } = formData
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
    const handleSubmit = (e) => { e.preventDefault(); dispatch(loginUser(formData)) }
    useEffect(() => {
        if (user) navigate("/")
        if (isError && message) toast.error(message, { position: "top-center" })
    }, [user, isError, message])
    if (isLoading) return <h1 className="text-center my-10">Loading...</h1>
    return (
        <div className="min-h-screen flex">
            {/* Left - Branding / Info */}
            <div className="hidden lg:flex lg:w-[55%] bg-charcoal text-white relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-transparent to-amber-900/30"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-600 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative">
                    <div className="flex items-center gap-2 mb-12">
                        <Sparkles className="w-7 h-7 text-amber-400" />
                        <span className="text-xl font-bold tracking-wide">Meta Fashion</span>
                    </div>
                    <h1 className="text-5xl font-bold leading-tight">Fashion that fits<br />your <span className="text-amber-400">digital twin</span></h1>
                    <p className="mt-4 text-white/60 text-lg max-w-lg">Join thousands of shoppers who have already discovered the future of fashion — try clothes in real-time 3D.</p>
                    <div className="mt-10 space-y-4">
                        <div className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0"><Upload className="w-5 h-5 text-white" /></div>
                            <div><h4 className="font-semibold text-sm">Upload Your Photo</h4><p className="text-xs text-white/60 mt-1">Apni image upload karo, AI body measurements analyse karega</p></div>
                        </div>
                        <div className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0"><Shirt className="w-5 h-5 text-charcoal" /></div>
                            <div><h4 className="font-semibold text-sm">Change Clothes in Real-Time 3D</h4><p className="text-xs text-white/60 mt-1">Koi bhi outfit select karo aur dekho 3D me instant try-on</p></div>
                        </div>
                        <div className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0"><Eye className="w-5 h-5 text-white" /></div>
                            <div><h4 className="font-semibold text-sm">Preview Your Perfect Fit</h4><p className="text-xs text-white/60 mt-1">Dekho kapda aap par kaisa lagega — before you buy</p></div>
                        </div>
                    </div>
                </div>
                <p className="relative text-xs text-white/40">© 2026 Meta Fashion — Real-time AI Try-On Experience</p>
            </div>
            {/* Right - Form */}
            <div className="flex-1 bg-[#F9F7F4] flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 justify-center mb-6">
                        <Sparkles className="w-6 h-6 text-amber-600" /><span className="font-bold">Meta Fashion</span>
                    </div>
                    <h2 className="text-3xl font-bold text-charcoal">Welcome Back</h2>
                    <p className="text-sm text-charcoal/60 mt-2">Sign in to continue your fashion journey</p>
                    <div className="bg-white rounded-3xl shadow-xl border border-charcoal/5 p-8 mt-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-charcoal mb-2">Email Address</label>
                                <input name='email' value={email} onChange={handleChange} type="email" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-charcoal mb-2">Password</label>
                                <input name='password' value={password} onChange={handleChange} type="password" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600" placeholder="••••••••" />
                            </div>
                            <button type="submit" className="w-full bg-charcoal text-white py-3.5 rounded-xl font-semibold hover:bg-black transition-all">Sign In</button>
                        </form>
                        <p className="text-center text-sm text-gray-600 mt-6">Don't have an account? <Link to="/register" className="text-amber-600 font-semibold">Create Free Account</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;
