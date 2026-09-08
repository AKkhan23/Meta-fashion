import React from 'react'
import { cancelMyOrder } from '../features/order/orderSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const CanceOrderModal = ({ handleCancelOrder, cancelOrderId }) => {

    const dispatch = useDispatch()

    const cancelOrder = (orderId) => {
        dispatch(cancelMyOrder(orderId))
        handleCancelOrder(null)
        toast.success("Order Cancelled!")
    }


    return (
        <div className="mt-10 bg-white rounded-2xl shadow-md p-6 mb-12">
            <div className="max-w-md mx-auto text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
                <p className="text-gray-600 mb-6">Order Id : {cancelOrderId}</p>

                <div className="mb-6">
                    <label htmlFor="cancel-reason" className="block text-left text-sm font-medium text-gray-700 mb-2">
                        Reason for cancellation
                    </label>
                    <select
                        id="cancel-reason"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option>Select a reason</option>
                        <option>Changed my mind</option>
                        <option>Found a better price</option>
                        <option>Ordered by mistake</option>
                        <option>Delivery time too long</option>
                        <option>Other</option>
                    </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => handleCancelOrder(null)} className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-3 px-6 rounded-xl transition-colors">
                        Keep Order
                    </button>
                    <button onClick={() => cancelOrder(cancelOrderId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
                        Yes, Cancel Order
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CanceOrderModal
