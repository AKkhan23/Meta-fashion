import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import { loginUser } from '../features/auth/authSlice';

function Login() {

    const { isLoading, isSuccess, isError, message, user } = useSelector(state => state.auth)


    const [formData, setFormData] = useState({ email: "", password: "" })

    const { email, password } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        // Login User
        dispatch(loginUser(formData))
    }

    useEffect(() => {

        if (user) {
            navigate("/")
        }

        if (isError && message) {
            toast.error(message, { position: "top-center" })
        }


    }, [user, isError, message])


    if (isLoading) {
        return (
            <h1 className="text-center my-10">Loading...</h1>
        )
    }




    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-8 h-8 text-amber-600" />
                        <span className="text-2xl font-bold text-gray-900">Meta Fashion</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to continue your fashion journey</p>
                </div>

                <div className="bg-white bg-opacity-80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                Email Address
                            </label>
                            <input
                                name='email'
                                value={email}
                                onChange={handleChange}
                                type="email"
                                id="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-300"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                                Password
                            </label>
                            <input
                                name='password'
                                value={password}
                                onChange={handleChange}
                                type="password"
                                id="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-700">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-300">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[var(--color-gold)] to-amber-700 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-300">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
