import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../features/auth/authSlice';

function Register() {

    const { isLoading, isSuccess, isError, message, user } = useSelector(state => state.auth)


    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", address: "" })

    const { name, email, phone, password, confirmPassword, address } = formData

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
        // Register User

        if (password !== confirmPassword) {
            toast.error("Passwords Not Match!", { position: "top-center" })
        } else {
            dispatch(registerUser(formData))
        }


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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
                    <p className="text-gray-600">Start your virtual fashion experience today</p>
                </div>

                <div className="bg-white bg-opacity-80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name='name'
                                value={name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-300"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name='email'
                                value={email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-300"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="phone"
                                id="phone"
                                name='phone'
                                value={phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-300"
                                placeholder="+9198912345"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name='password'
                                value={password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                Your Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                name='address'
                                value={address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-300"
                                placeholder="103 Apollo Avenue Old Palasia Indore"
                            />
                        </div>

                        <div>
                            <label className="flex items-start gap-3 text-sm text-gray-700">
                                <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-300 text-amber-600 focus:ring-amber-600" />
                                <span>
                                    I agree to the{' '}
                                    <a href="#" className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-300">
                                        Terms & Conditions
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-300">
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                        </div>



                        <button
                            type="submit"
                            className="w-full bg-[var(--color-gold)] to-amber-700 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Create Account
                        </button>

                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <a href="#" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-300">
                                Login
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
