import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { cancelMyOrder, getMyOrder, getMyOrders } from '../features/order/orderSlice'
import OrderDetailsModal from '../components/OrderDetailsModal'
import { LoadingScreen } from '../components/LoadingScreen'
import CanceOrderModal from '../components/CanceOrderModal'

const Profile = () => {
    const { user } = useSelector(state => state.auth)
    const { order, orders, orderSuccess, orderError, orderLoading, orderErrorMessage } = useSelector(state => state.order)

    const [showOrder, setShowOrder] = useState(false)
    const [showCancelOrder, setShowCancelOrder] = useState(false)
    const [cancelOrderId, setCancelOrderId] = useState(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()



    const handleShowOrder = (orderId) => {
        if (orderId) {
            dispatch(getMyOrder(orderId))
        }
        setShowOrder(showOrder ? false : true)
    }


    const handleCancelOrder = (orderId) => {
        setCancelOrderId(orderId)
        setShowCancelOrder(showCancelOrder ? false : true)
    }




    useEffect(() => {
        if (!user) {
            navigate("/login")
        } else {
            // Fetch Orders
            dispatch(getMyOrders())
        }
    }, [user, dispatch, navigate])

    useEffect(() => {
        if (orderError && orderErrorMessage) {
            toast.error(orderErrorMessage, { position: "top-center" })
        }
    }, [orderError, orderErrorMessage])


    // Only show full-page loader on initial load when no orders yet; otherwise modal loading shouldn't blank the page
    if (orderLoading && orders.length === 0 && !showOrder) {
        return (
            <LoadingScreen loadingMessage={"Getting Orders"} />
        )
    }



    return (
        <div className="min-h-screen bg-gray-50 ">
            {
                showOrder && <OrderDetailsModal handleShowOrder={handleShowOrder} />
            }

            {
                showCancelOrder && <CanceOrderModal handleCancelOrder={handleCancelOrder} cancelOrderId={cancelOrderId} />
            }

            <div className={showOrder || showCancelOrder ? 'blur-sm max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
                <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                    <a href="/" className="hover:text-gray-900 transition-colors">Home</a>
                    <span>/</span>
                    <span className="text-gray-900">My Account</span>
                </nav>

                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Account</h1>
                    <p className="text-gray-600">Manage your profile and orders</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                                    {(user?.name || 'U').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name || '—'}</h2>
                                <p className="text-gray-600 text-sm mb-1">{user?.email || '—'}</p>
                                <p className="text-gray-600 text-sm mb-4">{user?.phone || ''}</p>
                                <p className="text-gray-500 text-xs mb-6">{user?.address || ''}</p>
                                <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
                                    Virtual Try Credits :   {user?.credits ?? 0}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>

                            <div className="space-y-4">
                                {orders.length === 0 ? (
                                    <p className="text-gray-500 text-sm py-4 text-center">No orders yet.</p>
                                ) : (
                                    orders.map(item => {
                                        return (
                                            <div key={item._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                                                    <div className="mb-2 sm:mb-0">
                                                        <p className="text-sm text-gray-500">Order ID</p>
                                                        <p className="font-semibold text-gray-900">#{item._id}</p>
                                                    </div>
                                                    <div className="mb-2 sm:mb-0">
                                                        <p className="text-sm text-gray-500">Date</p>
                                                        <p className="font-medium text-gray-900">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '-'}</p>
                                                    </div>
                                                    <div className="mb-2 sm:mb-0">
                                                        <p className="text-sm text-gray-500">Total</p>
                                                        <p className="font-semibold text-gray-900">₹{item.totalBillAmount}</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <button onClick={() => handleShowOrder(item._id)} className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                                                        View Details
                                                    </button>
                                                    {
                                                        item.status === "placed" && <button onClick={() => handleCancelOrder(item._id)} className="bg-white hover:bg-red-50 text-red-600 border border-red-600 text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                                                            Cancel Order
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>








                {orders.length === 0 && (
                <div className="bg-white rounded-2xl shadow-md p-12">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start exploring our collection!</p>
                        <button onClick={() => navigate('/collections')} className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-8 rounded-xl transition-colors">
                            Start Shopping
                        </button>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}

export default Profile
