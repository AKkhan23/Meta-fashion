// src/components/Layout.tsx
import { LayoutDashboard, Users, Package, Star, ShoppingCart, Tag, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../features/auth/authSlice';


function Layout({ children, activeMenu, pageTitle }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()


    const handleLogout = () => {
        navigate("/")
        dispatch(logoutUser())
    }


    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'coupons', label: 'Coupons', icon: Tag },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold">Meta Fashion</h1>
                    <p className="text-sm text-gray-400">Admin Panel</p>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.id}>
                                    <Link
                                        to={`/admin/${item.id}`}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeMenu === item.id
                                            ? 'bg-amber-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{pageTitle}</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                            <span className="text-amber-600 font-semibold">A</span>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors">
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;
