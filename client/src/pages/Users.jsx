// src/pages/Users.tsx
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { Eye, Ban, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { LoadingScreen } from '../components/LoadingScreen';
import { getAllUsersForAdmin, updateUser } from '../features/admin/adminSlice';

function Users() {

    const { user } = useSelector(state => state.auth)
    const { adminIsLoading, adminIsSuccess, adminIsError, adminErrorMessage, allProducts, allOrders, allUsers, allCoupons } = useSelector(state => state.admin)



    const navigate = useNavigate()
    const dispatch = useDispatch()


    // Update User
    const handleUpdateUser = (status) => {
        dispatch(updateUser(status))
    }



    useEffect(() => {
        if (!user?.isAdmin) {
            navigate("/")
        } else {
            // Api's Fetching
            dispatch(getAllUsersForAdmin())
        }
    }, [user, dispatch, navigate])

    useEffect(() => {
        if (adminIsError && adminErrorMessage) {
            toast.error(adminErrorMessage, { position: "top-center" })
        }
    }, [adminIsError, adminErrorMessage])



    if (adminIsLoading) {
        return (
            <LoadingScreen loadingMessage={"Users Loading...."} />
        )
    }


    return (
        <Layout activeMenu="users" pageTitle="Users">
            <div className="bg-white rounded-xl shadow-md border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">All Users</h3>
                        <input
                            type="search"
                            placeholder="Search users..."
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {
                                allUsers.map(user => {
                                    return (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-900">#{user._id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-violet-800">{user.phone}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={user.isActive ? "px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800" : "px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800"}>{user.isActive ? "Active" : "InActive"}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {
                                                        user.isActive ? (
                                                            <button onClick={() => handleUpdateUser({ userId: user._id, isActive: false })} className=" cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                                <Ban className="w-4 h-4" />
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => handleUpdateUser({ userId: user._id, isActive: true })} className=" cursor-pointer p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }


                        </tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing 1 to 8 of 2,847 users</p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Previous
                        </button>
                        <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                            1
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            2
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            3
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Users;
